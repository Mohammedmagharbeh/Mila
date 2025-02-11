// import React, { useEffect, useState } from 'react';
// import { fetchCars } from '../back/api';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

// function Users() {
//     const [car,setCar]=useState([])
//     var cars = [
//         { id: 1, username: 'JohnDoe', year: 'Watch, Belt', price: 120 },
//         { id: 2, username: 'JaneSmith', year: 'Bag, Shoes', price: 200 },
//         { id: 3, username: 'AliceJones', year: 'Ring, Necklace', price: 300 },
//       ];
// useEffect(()=>{
//     fetchCars().then(res=>{
//         const formcarupdated=res.data.map(car=>({
//             id:car._id,
//             username:car.username,
//             year:car.year,
//             price:car.price

//         }))
      
// cars=formcarupdated
// setCar(formcarupdated)
//     })
// },[])

  


//   return (
//     <>
//       <Typography variant="h4" gutterBottom>
//         Order Pemail
//       </Typography>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>car ID</TableCell>
//               <TableCell>carusername</TableCell>
//               <TableCell>Items</TableCell>
//               <TableCell>roul</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {car.map((car) => (
//               <TableRow key={car.id}>
//                 <TableCell>{car.id}</TableCell>
//                 <TableCell>{car.username}</TableCell>
//                 <TableCell>{car.year}</TableCell>
//                 <TableCell>{car.roul}</TableCell>

//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Typography variant="h6" align="right" marginTop={2}>
//       </Typography>
//     </>
//   );
// }

// export default Users;


import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useState,useEffect } from 'react';
import { deleteUser, fetchuser, postusers,postregitrer,updateuser } from '../back/api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

const roles = ['admin','user'];

const generateRandomId = () => Math.floor(Math.random() * 1000000); // توليد رقم عشوائي كـ ID
const generateRandomuserusername = () => `Trader ${Math.floor(Math.random() * 100)}`; // توليد اسم عشوائي
const generateRandomDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - Math.floor(Math.random() * 10)); // تعيين تاريخ عشوائي من السنوات الماضية
  return date.toISOString().split('T')[0]; // تحويل التاريخ إلى صيغة string
};
const generateRandomRole = () => roles[Math.floor(Math.random() * roles.length)];

const initialRows = [
  {
    id: generateRandomId(),
    username: generateRandomuserusername(),
    email: 'llol@gmail.com',
    joinDate: generateRandomDate(),
    role: generateRandomRole(),
  },
  {
    id: generateRandomId(),
    username: generateRandomuserusername(),
    email: 'example@example.com',
    joinDate: generateRandomDate(),
    role: generateRandomRole(),
  },
  {
    id: generateRandomId(),
    username: generateRandomuserusername(),
    email: 'example@example.com',
    joinDate: generateRandomDate(),
    role: generateRandomRole(),
  },
  {
    id: generateRandomId(),
    username: generateRandomuserusername(),
    email: 'example@example.com',
    joinDate: generateRandomDate(),
    role: generateRandomRole(),
  },
  {
    id: generateRandomId(),
    username: generateRandomuserusername(),
    email: 'example@example.com',
    joinDate: generateRandomDate(),
    role: generateRandomRole(),
  },
];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
  
    
    const id = generateRandomId(); // استخدام الدالة المعرفة generateRandomId بدلاً من randomId
    setRows((oldRows) => [
      ...oldRows,
      { id, username: '', email: '', role: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'username' },
    }));
  };
  
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [user,setUser]=useState([])
  const [open, setOpen] = React.useState(false);
  const[confirmDelete,setconfirmDelete]=useState(false)
  const [Deleteid,seDeleteid]=useState(null)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    
  useEffect(()=>{
    fetchuser().then(res=>{
          const formcarupdated=res.data.map(user=>({
              id:user._id,
              username:user.username,
              email:user.email,
              role:user.roul
          }))
     setRows(formcarupdated); // قم بتحديث rows هنا بعد الجلب

      })
  },[])
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async(confirmDelete) => {
    if(confirmDelete&&Deleteid){
    setRows(rows.filter((row) => row.id !== Deleteid));
    await deleteUser(Deleteid)

      
    }
    setOpen(false);
  };


  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });

  };

  const handleSaveClick = (id) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    const editedRow = rows.find((row) => row.id === id);

    // setRows(rows.filter((row) => row.id !== id));
  };

  
const handleDeleteClick = (id) => async () => {
  seDeleteid(id)
  handleClickOpen()
  // const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا المستخدم؟");

  // if (confirmDelete) {
  //   setRows(rows.filter((row) => row.id !== id));
  //   await deleteUser(id);
  // }
};

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    console.log("Updating user:", newRow);
  
    if (newRow.isNew) {
      const user = {
        id: newRow._id,
        username: newRow.username,
        email: newRow.email,
        password: "123",
        roul: newRow.role,  // تم تعديل هنا: إرسال "roul" بدلاً من "role"
      };
  
      await postregitrer(user);
    } else {
      const userUpdate = {
        username: newRow.username,
        email: newRow.email,
        roul: newRow.role,  // تعديل هنا أيضاً
      };
  
      await updateuser(newRow.id, userUpdate);
      console.log(userUpdate);
    }
  
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };
  


  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'username', headerName: 'Username', width: 180, editable: true },
    {
      field: 'email',
      headerName: 'Email',
      type: 'string',
      width: 200,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 220,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['admin', 'user'],
    },
    // باقي الأعمدة...
  
  
    {
      field: 'actions',
      type: 'actions',
      headeruserusername: 'Actions',
      width: 100,
      cellClassuserusername: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
  
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              classuserusername="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
          
        }
  
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            classuserusername="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
      
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
       <React.Fragment>
     
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={()=>handleClose(false)}>
            Disagree
          </Button>
          <Button onClick={()=>{handleClose(true)}} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
    </Box>
  );
}

