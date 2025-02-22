import React, { useEffect, useState } from 'react';
import { Button, Transfer } from 'antd';
import './ManyToManyField.css';

const convertData = (items, chosen = false) =>
  items.map(({ id, __str__ }) => ({ key: id.toString(), title: __str__, chosen }));

export const ManyToManyField = ({ data, onChange }) => {
  const [mockData, setMockData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  useEffect(() => {
    const newMockData = [...convertData(data.value, true), ...convertData(data.available, false)];
    setMockData(newMockData);
    setTargetKeys(newMockData.filter((item) => item.chosen).map((item) => item.key));
  }, [data]);

  const updateTargetKeys = (newKeys) => {
    setTargetKeys(newKeys);
    onChange(newKeys);
  };

  const handleDoubleClick = (key) => {
    updateTargetKeys(targetKeys.includes(key) ? targetKeys.filter((k) => k !== key) : [...targetKeys, key]);
  };

  const renderFooter = (_, { direction }) => (
    <Button
      size="small"
      style={{ display: 'flex', margin: 8, marginRight: 'auto', marginInlineStart: 'auto' }}
      onClick={() => updateTargetKeys(direction === 'left' ? mockData.map(({ key }) => key) : [])}
    >
      {direction === 'left' ? 'Выбрать всё' : 'Удалить всё'}
    </Button>
  );

  return (
    <Transfer
      className="custom-transfer"
      titles={['Доступно', 'Выбрано']}
      dataSource={mockData}
      showSearch
      listStyle={{ width: 400, height: 300 }}
      targetKeys={targetKeys}
      onChange={updateTargetKeys}
      render={(item) => <div onDoubleClick={() => handleDoubleClick(item.key)}>{item.title}</div>}
      selectAllLabels={[
        ({ selectedCount, totalCount }) => `Выбрано ${selectedCount} из ${totalCount}`,
        ({ selectedCount, totalCount }) => `Выбрано ${selectedCount} из ${totalCount}`,
      ]}
      footer={renderFooter}
    />
  );
};
