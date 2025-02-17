import React from 'react';
import { ActiveLoanExpandedRow } from '../ActiveLoanExpandedRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@blueprintjs/core';
import {
  numberToUSD,
  numberToPercent,
  weiToNumberFormat,
} from 'utils/display-text/format';
import {
  faLongArrowAltUp,
  faLongArrowAltDown,
} from '@fortawesome/free-solid-svg-icons';
import { weiTo18 } from '../../../../../utils/blockchain/math-helpers';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { LoadableValue } from '../../../LoadableValue';

interface Props {
  data: any;
  setExpandedId: any;
  setExpandedItem: any;
  expandedId: any;
  expandedItem: any;
}

const useSortableData = (
  items,
  config = { key: 'none', direction: 'none' },
) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

export function ActiveLoanTableDesktop(props: Props) {
  const { t } = useTranslation();
  const { items, requestSort, sortConfig } = useSortableData(props.data);
  function getIcons(name) {
    if (sortConfig.key !== name) {
      return <Icon icon="double-caret-vertical" iconSize={15} />;
    } else if (sortConfig.direction === 'ascending') {
      return <Icon icon="sort-asc" iconSize={15} className="tw-text-white" />;
    } else {
      return <Icon icon="sort-desc" iconSize={15} className="tw-text-white" />;
    }
  }

  return (
    <div className="tw-bg-primary sovryn-border tw-p-4 tw-hidden md:tw-block">
      <table className="sovryn-table">
        <thead>
          <tr style={{ cursor: 'pointer' }}>
            <th onClick={() => requestSort('icon')}>{getIcons('icon')}</th>
            <th onClick={() => requestSort('positionInUSD')}>
              {t(translations.activeLoan.table.positionSize)}
              {getIcons('positionInUSD')}
            </th>
            <th onClick={() => requestSort('currentMargin')}>
              {t(translations.activeLoan.table.currentMargin)}
              {getIcons('currentMargin')}
            </th>
            <th onClick={() => requestSort('interestAPR')}>
              {t(translations.activeLoan.table.interestApr)}
              {getIcons('interestAPR')}
            </th>
            <th onClick={() => requestSort('startMargin')}>
              {t(translations.activeLoan.table.startPrice)}
              {getIcons('startMargin')}
            </th>
            <th onClick={() => requestSort('profit')}>
              {t(translations.activeLoan.table.profit)}
              {getIcons('profit')}
            </th>
            <th style={{ cursor: 'initial' }} />
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const expanded = props.expandedId === item.id;
            return (
              <React.Fragment key={item.id}>
                <tr
                  onClick={() => {
                    if (!expanded) {
                      props.setExpandedItem(item);
                      props.setExpandedId(item.id);
                    } else {
                      props.setExpandedId('');
                    }
                  }}
                  className={`tw-cursor-pointer ${
                    props.expandedId && !expanded && 'opaque'
                  }`}
                >
                  <td>
                    {item.icon === 'LONG' && (
                      <Icon
                        icon="circle-arrow-up"
                        className="tw-text-customTeal tw-mx-2"
                        iconSize={20}
                      />
                    )}
                    {item.icon === 'SHORT' && (
                      <Icon
                        icon="circle-arrow-down"
                        className="tw-text-Gold tw-mx-2"
                        iconSize={20}
                      />
                    )}{' '}
                    {item.pair}
                  </td>
                  <td>
                    <LoadableValue
                      loading={false}
                      value={
                        <>
                          {weiToNumberFormat(item.positionSize, 4)}{' '}
                          {item.currency}
                        </>
                      }
                      tooltip={weiTo18(item.positionSize)}
                    />
                  </td>
                  <td>
                    {numberToPercent(item.currentMargin, 2)}
                    <small
                      className={`md:tw-inline sm:tw-block tw-ml-2 tw-mr-2 ${
                        item.marginDiff > 0
                          ? 'tw-text-green-500'
                          : 'tw-text-red-500'
                      }`}
                    >
                      <div className="tw-inline">
                        <FontAwesomeIcon
                          icon={
                            item.marginDiff > 0
                              ? faLongArrowAltUp
                              : faLongArrowAltDown
                          }
                        />
                        {numberToPercent(item.marginDiff, 2)}
                      </div>
                    </small>
                  </td>
                  <td>{item.interestAPR} %</td>
                  <td>{numberToUSD(item.startPrice, 2)}</td>
                  <td>{item.profit}</td>
                  <td>{item.actions}</td>
                </tr>
                {props.expandedId === item.id && (
                  <ActiveLoanExpandedRow
                    className="tw-hidden md:tw-block"
                    data={item}
                    key={props.expandedId}
                    handleClick={() => props.setExpandedId('')}
                  />
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
