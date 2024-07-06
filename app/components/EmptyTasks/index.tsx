import React from 'react';
import styles from './empty.module.scss';

function EmptyTasks() {
  return (
    <div className={styles.container}>
      <h1>Задачи отсутствуют</h1>
    </div>
  );
}

export default EmptyTasks;
