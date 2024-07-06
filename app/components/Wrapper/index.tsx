'use client';

import React, { act, useEffect, useRef, useState } from 'react';
import styles from './wrapper.module.scss';
import allTodoIcon from '../../../public/allTodo.svg';
import Image from 'next/image';
import {
  useGetListsQuery,
  useAddListMutation,
  useRemoveListMutation,
  useChangeListTitleMutation,
  // useGetOneListQuery,
} from '@/app/redux/api/listsApi';

// icons
import plusIcon from '../../../public/plusIcon.svg';
import removeIcon from '../../../public/removeIcon.svg';
import closeIcon from '../../../public/close.svg';
import listEditIcon from '../../../public/editIcon.svg';

// components
import Todo from '../Todo';
import AddTask from '../AddTask';
import EmptyTasks from '../EmptyTasks';
import FullList from '../FullList';
import { ColorsType, ListType, TaskType } from '@/app/types';

const colors: ColorsType[] = [
  { id: 1, color: '#C9D1D3' },
  { id: 2, color: '#42B883' },
  { id: 3, color: '#64C4ED' },
  { id: 4, color: '#FFBBCC' },
  { id: 5, color: '#B6E6BD' },
  { id: 6, color: '#C355F5' },
  { id: 7, color: '#09011A' },
  { id: 8, color: '#FF6464' },
];

function Wrapper() {
  // server actions
  const { data } = useGetListsQuery({});
  // const { data: oneList } = useGetOneListQuery({});
  const [addList] = useAddListMutation({});
  const [removeList] = useRemoveListMutation();
  const [changeListTitle] = useChangeListTitleMutation();
  // ==================================

  const [open, setOpen] = useState<boolean>(false);
  const [activeList, setActiveList] = useState<number>(0);
  const [activeColor, setActiveColor] = useState<string>('#C9D1D3');
  const popupRef = useRef<HTMLDivElement>(null);
  const [openAddTask, setOpenAddTask] = useState<{ [key: number]: boolean }>({});
  const addTaskRef = useRef<HTMLDivElement>(null);
  const [listValue, setListValue] = useState('');
  const [currentList, setCurrentList] = useState<ListType | null>(null);

  useEffect(() => {
    if (activeList && data) {
      const selectedList = data.find((list: ListType) => list.id === activeList);
      setCurrentList(selectedList);
    }
  }, [activeList, data]);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (event.target instanceof Node && !popupRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.body.addEventListener('click', handleClickOutside);

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const onEdit = async (id: number, title: string) => {
    const newTitle = window.prompt('Изменить заголовок списка', title);
    try {
      if (newTitle !== null) {
        await changeListTitle({
          id,
          newTitle,
        });
      }
    } catch (err) {
      alert(err);
      console.warn(err, 'Ошибка при изменении заголовока списка');
    }
  };

  const onSelectColor = (color: string) => {
    setActiveColor(color);
  };

  const onClosePopup = () => {
    setOpen(!open);
    setActiveColor('#C9D1D3');
  };

  const onAddList = async () => {
    try {
      if (!listValue) {
        return alert('Напишите пустой заполните его!');
      }

      if (!activeColor) {
        return alert('Выберите какой то цвет!');
      }

      const obj = {
        title: listValue,
        color: activeColor,
        tasks: [],
      };
      await addList(obj).then(() => {
        setOpen(!open);
        setListValue('');
      });
    } catch (err) {
      alert(err);
      console.warn(err);
    }
  };

  // console.log(activeList);

  const onRemoveList = async (id: string) => {
    try {
      const message = window.confirm('Вы действительно хотите удалить список?');

      if (message) {
        await removeList(id).unwrap();
      }
    } catch (err) {
      alert(err);
      console.warn(err);
    }
  };

  // console.log('activeColor', activeColor);

  const onShowLists = () => {
    setActiveList(0);
    setCurrentList(null);
  };

  const toggleAddTask = (listId: number) => {
    setOpenAddTask((prevState) => ({
      ...prevState,
      [listId]: !prevState[listId],
    }));
  };

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <article
          onClick={onShowLists}
          className={`${styles.allTasks} ${!activeList ? styles.active : ''}`}>
          <Image width={15} height={15} src={allTodoIcon} alt="all-todos icon" />
          <span>Все задачи</span>
        </article>
        <ul className={styles.lists}>
          {data &&
            data.map((list: ListType) => (
              <li
                onClick={() => setActiveList(list.id)}
                className={`${styles.list} ${list.id === activeList ? styles.active : ''}`}
                key={list.id}>
                <div style={{ background: list.color }} className={styles.circle}></div>
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '165px',
                  }}>
                  {list.title}
                </span>
                <Image
                  onClick={() => onRemoveList(String(list.id))}
                  className={styles.removeIcon}
                  src={removeIcon}
                  alt="remove-list icon"
                />
              </li>
            ))}
        </ul>
        <div onClick={onClosePopup} className={styles.addList}>
          <Image width={15} height={15} src={plusIcon} alt="plusIcon" />
          <span>Добавить папку</span>
        </div>

        {open && (
          <div ref={popupRef} className={styles.createList_popup}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className={styles.container}>
                <Image
                  onClick={onClosePopup}
                  className={styles.closeIcon}
                  src={closeIcon}
                  alt="close icon"
                />
                <input
                  type="text"
                  placeholder="Название папки"
                  value={listValue}
                  onChange={(e) => setListValue(e.target.value)}
                />
                <section className={styles.colors}>
                  {colors.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectColor(item.color)}
                      style={{ background: item.color }}
                      className={`${styles.roundColors} ${
                        item.color === activeColor ? styles.activeColor : ''
                      }`}></div>
                  ))}
                </section>
                <button onClick={onAddList}>Добавить</button>
              </div>
            </div>
          </div>
        )}
      </aside>
      <section className={styles.fullList}>
        {currentList ? (
          <>
            {currentList.tasks.length > 0 && (
              <h1>
                <span style={{ color: currentList?.color }}>{currentList?.title}</span>
                <Image
                  onClick={() => onEdit(currentList.id, currentList.title)}
                  className={styles.listEditIcon}
                  src={listEditIcon}
                  alt="list edit icon"
                />
              </h1>
            )}

            <div className={styles.todos}>
              {!currentList?.tasks?.length ? (
                <EmptyTasks />
              ) : (
                currentList?.tasks?.map((task: TaskType) => (
                  <Todo listId={currentList.id} {...task} />
                ))
              )}

              {!openAddTask && (
                <div onClick={() => setOpenAddTask({})} className={styles.addTaskBtn}>
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

                  <span>{currentList?.tasks.length > 0 ? 'Новая задача' : 'Создать задачу'}</span>
                </div>
              )}

              {openAddTask && (
                <AddTask
                  id={currentList.id}
                  setOpenAddTask={setOpenAddTask}
                  addTaskRef={addTaskRef}
                />
              )}
            </div>
          </>
        ) : (
          <div className={styles.allLists_section}>
            {data &&
              data.map((list: ListType) => (
                <div className={styles.listContainer}>
                  <FullList
                    key={list.id}
                    list={list}
                    onEdit={onEdit}
                    openAddTask={openAddTask[list.id] || false}
                    setOpenAddTask={() => toggleAddTask(list.id)}
                    addTaskRef={addTaskRef}
                  />
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Wrapper;
