import React from "react";
import { Link } from "react-router-dom";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

/**
 * Трансформирует поля в колонки таблицы.
 *
 * @param {Array} fields - Поля таблицы, полученные с сервера.
 * @param {Array} listDisplayLinks - Поля, которые будут ссылками.
 * @param {Array} sortOrder - Текущий порядок сортировки.
 * @param {Function} setSortOrder - Функция для изменения сортировки.
 * @param {String} appLabel - Название приложения.
 * @param {String} modelName - Название модели.
 * @returns {Array} Массив колонок для таблицы.
 */
export const transformFieldsToColumns = (
  fields,
  listDisplayLinks,
  sortOrder,
  setSortOrder,
  appLabel,
  modelName
) => {
  const handleSort = (columnIndex) => {
    setSortOrder((prevSortOrder) => {
      const existingSort = prevSortOrder.find(
        (item) => item.columnIndex === columnIndex
      );
      const newOrder = [...prevSortOrder];

      if (existingSort) {
        if (existingSort.order === "asc") {
          existingSort.order = "desc";
        } else {
          return newOrder.filter((item) => item.columnIndex !== columnIndex);
        }
      } else {
        newOrder.push({ columnIndex, order: "asc" });
      }
      return newOrder;
    });
  };

  return fields.map((field, index) => {
    const columnIndex = index + 1; // Индексы колонок начинаются с 1
    const sortInfo = sortOrder.find((item) => item.columnIndex === columnIndex);
    const sortIcon = sortInfo
      ? sortInfo.order === "asc"
        ? <CaretUpOutlined />
        : <CaretDownOutlined />
      : null;

    const sortPriority = sortOrder.findIndex(
      (item) => item.columnIndex === columnIndex
    );
    const priorityLabel =
      sortPriority !== -1 ? (
        <span style={{ marginLeft: "4px" }}>{sortPriority + 1}</span>
      ) : null;

    const removeSortIcon = sortInfo ? (
      <CloseCircleOutlined
        onClick={(e) => {
          e.stopPropagation();
          setSortOrder((prevSortOrder) =>
            prevSortOrder.filter((item) => item.columnIndex !== columnIndex)
          );
        }}
      />
    ) : null;

    const column = {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            maxHeight: 20,
          }}
          onClick={() => handleSort(columnIndex)}
        >
          <span>{field.verbose_name}</span>
          <span style={{ marginLeft: "4px" }}>{priorityLabel}</span>
          <span style={{ marginLeft: "4px" }}>{sortIcon}</span>
          {sortInfo && (
            <span
              style={{ marginLeft: "4px", visibility: "hidden" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.visibility = "visible")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.visibility = "hidden")
              }
            >
              {removeSortIcon}
            </span>
          )}
        </div>
      ),
      dataIndex: field.name,
      key: field.name,
    };

    if (listDisplayLinks.includes(field.name)) {
      column.render = (text, record) => (
        <Link
          to={`/django_spa/admin/${appLabel}/${modelName}/${record.pk}/change/`}
          style={{ color: "#417893", cursor: "pointer" }}
        >
          {text}
        </Link>
      );
    }

    if (field.type === "BooleanField") {
      column.render = (status) => {
        return status === null ? (
          <QuestionCircleOutlined />
        ) : status ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        );
      };
    }

    return column;
  });
};
