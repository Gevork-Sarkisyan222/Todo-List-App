import React, { useEffect } from 'react';
import styles from './addTask.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { setTaskValue } from '@/app/redux/slices/taskValue';
import { RootState } from '../../redux/store';
import axios from 'axios';
import { TaskType } from '@/app/types';
import { useAddTaskMutation, useRemvoeTaskMutation } from '@/app/redux/api/listsApi';

interface propsTypes {
  id: number;
  setOpenAddTask: (open: {}) => void;
  addTaskRef: React.RefObject<HTMLDivElement>;
}

const AddTask: React.FC<propsTypes> = ({ id, setOpenAddTask, addTaskRef }) => {
  useEffect(() => {
    const handleClickOutsideOfTask = (event: Event) => {
      if (event.target instanceof Node && !addTaskRef.current?.contains(event.target)) {
        setOpenAddTask(false);
      }
    };

    document.body.addEventListener('click', handleClickOutsideOfTask);

    return () => {
      document.body.removeEventListener('click', handleClickOutsideOfTask);
    };
  }, []);

  const dispatch = useDispatch();
  const taskValue = useSelector((state: RootState) => state.taskValue.taskValue);
  const [addTask] = useAddTaskMutation({});
  const [removeTask] = useRemvoeTaskMutation({});

  const handleClosePopup = () => {
    setOpenAddTask(false);
    dispatch(setTaskValue(''));
  };

  async function handleAddTask() {
    try {
      const res = await axios.get(`http://localhost:5000/lists/${id}`);
      const list = res.data;

      const newTask = {
        id: Date.now().toString(),
        title: taskValue,
        isCompleted: false,
      };

      const createdTask = [...list.tasks, newTask];

      dispatch(setTaskValue(''));
      setOpenAddTask(false);
      await addTask({ listId: id, createdTask });
    } catch (err) {
      alert(err);
      console.error('Error:', err);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div ref={addTaskRef} className={styles.addTask}>
      <input
        value={taskValue}
        onChange={(e) => dispatch(setTaskValue(e.target.value))}
        type="text"
        placeholder="Текст задачи"
        onKeyDown={handleKeyDown}
      />
      <div className={styles.buttons}>
        <button onClick={handleAddTask} className={styles.btn1}>
          Добавить задачу
        </button>
        <button onClick={handleClosePopup} className={styles.btn2}>
          Отмена
        </button>
      </div>
    </div>
  );
};

export default AddTask;
