import React from 'react';
import styles from '../Wrapper/wrapper.module.scss';
import listEditIcon from '../../../public/editIcon.svg';
import Image from 'next/image';
import AddTask from '../AddTask';
import Todo from '../Todo';
import { ListType, TaskType } from '@/app/types';

interface propsType {
  list: ListType;
  onEdit: (id: number, title: string) => void;
  openAddTask: boolean;
  setOpenAddTask: (openAddTask: boolean) => void;
  addTaskRef: React.RefObject<HTMLDivElement>;
}

const FullList: React.FC<propsType> = ({
  list,
  onEdit,
  openAddTask,
  setOpenAddTask,
  addTaskRef,
}) => {
  return (
    <section>
      <h1>
        <span style={{ color: list?.color }}>{list?.title}</span>
        <Image
          onClick={() => onEdit(list.id, list.title)}
          className={styles.listEditIcon}
          src={listEditIcon}
          alt="list edit icon"
        />
      </h1>

      <div className={styles.todos}>
        {list?.tasks?.map((task: TaskType) => (
          <Todo listId={list.id} {...task} />
        ))}

        {!openAddTask && (
          <>
            {list.tasks.length === 0 && <h3 style={{ color: '#C9D1D3' }}>Нету задач</h3>}
            <div onClick={() => setOpenAddTask(true)} className={styles.addTaskBtn}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 1V11"
                  stroke="#B4B4B4"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M1 6H11"
                  stroke="#B4B4B4"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              {/* <span id={list.id}>{list?.tasks.length > 0 ? 'Новая задача' : 'Создать задачу'}</span> */}
              <span>{list?.tasks.length > 0 ? 'Новая задача' : 'Создать задачу'}</span>
            </div>
          </>
        )}

        {openAddTask && (
          <AddTask
            id={list.id}
            setOpenAddTask={() => setOpenAddTask(false)}
            addTaskRef={addTaskRef}
          />
        )}
      </div>
    </section>
  );
};

export default FullList;
