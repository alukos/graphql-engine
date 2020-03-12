import React from 'react';

import { JSONB, JSONDTYPE, TEXT, BOOLEAN, getPlaceholder } from '../../utils';
import JsonInput from '../../../../Common/CustomInputTypes/JsonInput';
import TextInput from '../../../../Common/CustomInputTypes/TextInput';
import styles from '../../../../Common/TableCommon/Table.scss';
import { isColumnAutoIncrement } from '../../../../Common/utils/pgUtils';

export const TypedInput = ({
  enumOptions,
  col,
  index,
  clone,
  inputRef,
  onChange,
  onFocus,
  prevValue,
  hasDefault,
}) => {
  const {
    column_name: colName,
    data_type: colType,
    column_default: colDefault,
  } = col;

  const isAutoIncrement = isColumnAutoIncrement(col);
  const placeHolder = hasDefault ? colDefault : getPlaceholder(colType);
  const getDefaultValue = () => {
    if (prevValue) return prevValue;
    if (clone && colName in clone) return clone[colName];
    return '';
  };

  const onClick = e => {
    e.target
      .closest('.radio-inline')
      .querySelector('input[type="radio"]').checked = true;
    e.target.focus();
  };

  const standardInputProps = {
    onChange,
    onFocus,
    onClick,
    ref: inputRef,
    'data-test': `typed-input-${index}`,
    className: `form-control ${styles.insertBox}`,
    defaultValue: getDefaultValue(),
    type: 'text',
    placeholder: 'text',
  };
  if (enumOptions && enumOptions[colName]) {
    return (
      <select
        {...standardInputProps}
        className={`form-control ${styles.insertBox}`}
        defaultValue={prevValue || ''}
      >
        <option disabled value="">
          -- enum value --
        </option>
        {enumOptions[colName].map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (isAutoIncrement) {
    return <input {...standardInputProps} readOnly placeholder={placeHolder} />;
  }

  if (prevValue && typeof prevValue === 'object') {
    return (
      <JsonInput
        standardProps={{
          ...standardInputProps,
          defaultValue: JSON.stringify(prevValue),
        }}
        placeholderProp={getPlaceholder(colType)}
      />
    );
  }

  switch (colType) {
    case JSONB:
    case JSONDTYPE:
      return (
        <JsonInput
          {...standardInputProps}
          defaultValue={
            prevValue ? JSON.stringify(prevValue) : getDefaultValue()
          }
          placeholderProp={placeHolder}
        />
      );

    case TEXT:
      return (
        <TextInput
          standardProps={standardInputProps}
          placeholderProp={placeHolder}
        />
      );

    case BOOLEAN:
      return (
        <select {...standardInputProps} defaultValue={placeHolder}>
          <option value="" disabled>
            -- bool --
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      );

    default:
      return <input {...standardInputProps} placeholder={placeHolder} />;
  }
};
