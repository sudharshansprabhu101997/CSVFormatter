import React from 'react';
import { CSVReader } from 'react-papaparse';
import Button from 'react-bootstrap/Button';

const CsvFormater = () => {
  let newCsvArray = [];

  const handlePunchData = (data) => {

    let splittedData = data.split(',');
    let newData = [];
    let validatedArr = [];
    let cn = [];
    splittedData.forEach(function (i, index) {
      if (index === splittedData.length - 1)
      {
        return;
      }
      let prev = index > 0 ? splittedData[index - 1] : '';
      let cur = i;
      let next = index === splittedData.length - 1 ? '' : splittedData[index + 1];


      if (index === 0)
      {
        if (!cur.includes('in') && !cur.includes('out') && next.includes('out'))
        {
          cn = cur.split(':');
          cn[2] = 'in'.concat(cn[2]);
          validatedArr.push(cn.join(':'));
          splittedData[index] = cn.join(':');
        }
        else if (!cur.includes('in') && !cur.includes('out') && next.includes('in'))
        {
          cn = cur.split(':');
          cn[2] = 'out'.concat(cn[2]);
          validatedArr.push(cn.join(':'));
          splittedData[index] = cn.join(':');
        }
        else
        {
          validatedArr.push(i);
        }

      }
      else if (index > 0)
      {
        if ((!cur.includes('in') && !cur.includes('out')))
        {
          if (next.includes('in'))
          {
            cn = cur.split(':');
            cn[2] = 'out'.concat(cn[2]);
            validatedArr.push(cn.join(':'));
            splittedData[index] = cn.join(':');
          }
          else if (next.includes('out'))
          {
            cn = cur.split(':');
            cn[2] = 'in'.concat(cn[2]);
            validatedArr.push(cn.join(':'));
            splittedData[index] = cn.join(':');
          }
          else
          {
            validatedArr.push(i);
          }
        }
        else
        {
          validatedArr.push(i);
        }
      }
      else
      {
        validatedArr.push(i);
      }
    });

    validatedArr.forEach(function (i, index) {
      newData.push((i.replace('TD', 'Downstair')));
    });

    return newData.join(';');

  };
  const handleRow = (data) => {
    let newRow = [];
    const punchData = handlePunchData(data[data.length - 1]);

    newRow.push(data[0]);
    newRow.push(data[1]);
    newRow.push(data[2]);
    newRow.push(data[9]);
    newRow.push(data[10]);
    newRow.push(data[13]);
    newRow.push(punchData);
    newRow.push(data[11]);
    newRow.push(data[16]);
    newRow.push(data[16]);
    newRow.push('NA');

    return newRow;

  };

  const handleOnDrop = (data) => {

    newCsvArray = [];
    newCsvArray.push(['Sr No', 'ID NUMBER', 'EMP NAME', 'IN TIME', 'OUT TIME', 'TOTAL DURATION', 'PUNCH RECORDS', 'WORK DURATION', 'PRESENT/ABSENT', 'STATUS', 'REMARK']);

    console.log(data);
    let newArr = [];
    data.forEach(function (i, index) {
      newArr.push(i.data);
    });

    newArr.forEach(function (i, index) {
      newCsvArray.push(handleRow(i));
    });
    console.log(newCsvArray);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log('---------------------------');
    console.log(data);
    console.log('---------------------------');

  };

  const handleDownload = () => {
    let csv = "";
    newCsvArray.forEach(function (row) {
      csv += row.join(',');
      console.log(csv);
      csv += "\n";
    });

    console.log(csv);

    var hiddenElement = document.createElement('a');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    hiddenElement.href = url;//'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'timesheet.csv';
    hiddenElement.click();
  }


  return (
    <>
      <h5>Click and Drag Upload</h5>
      <CSVReader
        onDrop={handleOnDrop}
        onError={handleOnError}
        addRemoveButton
        onRemoveFile={handleOnRemoveFile}
      >
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>

      <Button onClick={handleDownload}>Download</Button>
    </>
  );
};

export default CsvFormater;





