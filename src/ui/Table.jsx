import React from 'react';

import styles from './Table.module.css';

const Table = ({ columns, data }) => {
  console.log('Data in Table', data);
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((item, index) => (
            <TableHeadItem item={item} key={index} />
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <TableRow key={index} item={item} columns={columns} />
        ))}
        {/* <tr>
          <td data-label="ID">1</td>
          <td data-label="Имя">Dinesh</td>
          <td data-label="Оплата">34</td>
          <td data-label="Общая сумма">50%</td>
        </tr> */}
      </tbody>
    </table>
  );
};

const TableHeadItem = ({ item }) => <th>{item.heading}</th>;
const TableRow = ({ columns, item }) => (
  <tr>
    {columns.map((columnItem, index) => {
      return (
        <td key={index} data-label={columnItem.heading}>
          {item[columnItem.value]}
        </td>
      );
    })}
  </tr>
);

export default Table;
