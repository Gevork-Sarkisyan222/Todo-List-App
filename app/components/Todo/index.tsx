import React, { useState } from 'react';
import styles from './todo.module.scss';
import Image from 'next/image';
import removeIcon from '../../../public/removeIcon.svg';
import axios from 'axios';
import { useRemvoeTaskMutation, useMakeCompletedMutation } from '@/app/redux/api/listsApi';
import { TaskType } from '@/app/types';

interface propsTypes {
  listId: string | number;
  id: string;
  title: string;
  isCompleted: boolean;
}

const Todo: React.FC<propsTypes> = ({ listId, id, title, isCompleted }) => {
  const taskId = id;

  const [checked, setChecked] = useState(isCompleted);
  const [removeTask] = useRemvoeTaskMutation({});
  const [makeCompleted] = useMakeCompletedMutation({});

  const toggleCheck = () => {
    setChecked(!checked);
  };

  async function handleRemoveTask() {
    try {
      if (window.confirm('Вы действительно хотите удалить задачу?')) {
        const res = await axios.get(`http://localhost:5000/lists/${listId}`);
        const list = res.data;

        const deletedTask = list.tasks.filter((task: TaskType) => task.id !== String(taskId));

        await removeTask({ listId, deletedTask });
      }
    } catch (err) {
      alert(err);
      console.error('Error:', err);
    }
  }

  console.log(checked);

  async function handleMakeCompleted() {
    try {
      toggleCheck();
      const res = await axios.get(`http://localhost:5000/lists/${listId}`);
      const list = res.data;

      const checkedTask = list.tasks.map((task: TaskType) => {
        if (task.id === taskId) {
          return {
            ...task,
            isCompleted: !task.isCompleted,
          };
        }
        return task;
      });

      await makeCompleted({ listId, checkedTask });
    } catch (err) {
      alert(err);
      console.error('Error:', err);
    }
  }

  return (
    <div className={styles.todo}>
      <input
        style={{ opacity: 0, position: 'absolute', left: '430px' }}
        checked={checked}
        type="checkbox"
        id="check"
      />
      <label
        onClick={handleMakeCompleted}
        htmlFor="check"
        className={`${styles.checkbox} ${checked ? styles.checked : ''}`}>
        <svg
          width="11"
          height="8"
          viewBox="0 0 11 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.29999 1.20001L3.79999 6.70001L1.29999 4.20001"
            stroke={checked ? '#FFFF' : '#B3B3B3'}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </label>
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '380px',
        }}>
        {title}
      </span>
      <Image
        onClick={handleRemoveTask}
        width={12}
        height={12}
        className={styles.removeIcon}
        src={removeIcon}
        alt="remove icon"
      />
    </div>
  );
};

export default Todo;
