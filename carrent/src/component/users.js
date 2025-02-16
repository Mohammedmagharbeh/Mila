import * as React from 'react';
import { Button, Fab, Badg,} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { deleteUser, fetchuser, postusers, postregitrer, updateuser } from '../back/api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EngineeringSharpIcon from '@mui/icons-material/EngineeringSharp';

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import Reservation from './Reservation';
import '../css/user.css'
const roles = ['admin', 'user'];


const generateRandomId = () => Math.floor(Math.random() * 1000000); // توليد رقم عشوائي كـ ID
const generateRandomuserusername = () => `Trader ${Math.floor(Math.random() * 100)}`; // توليد اسم عشوائي
const generateRandomDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - Math.floor(Math.random() * 10)); // تعيين تاريخ عشوائي من السنوات الماضية
  return date.toISOString().split('T')[0]; // تحويل التاريخ إلى صيغة string
};
const generateRandomRole = () => roles[Math.floor(Math.random() * roles.length)];
sessionStorage.getItem('username')
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
  if (window.location.pathname === '/user') {
   
    document.body.style.backgroundImage = "url('https://media.istockphoto.com/id/2148110386/photo/silhouette-generic-sedan-headlights-on.jpg?s=612x612&w=0&k=20&c=ylCatA6WAadFkQQuWMeBtPrQW9fAzmyUa5L0MncldUM=')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";  // جعل الصورة تغطي الشاشة بالكامل


  }
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
      <Button color="" startIcon={<AddIcon />} onClick={handleClick}
      >
        Add user
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [user, setUser] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [confirmDelete, setconfirmDelete] = useState(false);
  const [Deleteid, seDeleteid] = useState(null);
  const theme = useTheme();
  const navigate=useNavigate()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchuser().then((res) => {
      const formcarupdated = res.data.map((user) => ({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.roul,
      }));
      setRows(formcarupdated); // قم بتحديث rows هنا بعد الجلب
    });
  }, []);

  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async (confirmDelete) => {
    if (confirmDelete && Deleteid) {
      setRows(rows.filter((row) => row.id !== Deleteid));
      await deleteUser(Deleteid);
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
    // يمكنك تنفيذ تحديث للصف هنا إذا رغبت
  };

  const handleDeleteClick = (id) => async () => {
    seDeleteid(id);
    handleClickOpen();
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
    console.log('Updating user:', newRow);

    if (newRow.isNew) {
      const user = {
        id: newRow._id,
        username: newRow.username,
        email: newRow.email,
        password: '123',
        roul: newRow.role, // تم تعديل هنا: إرسال "roul" بدلاً من "role"
      };

      await postregitrer(user);
    } else {
      const userUpdate = {
        username: newRow.username,
        email: newRow.email,
        roul: newRow.role, // تعديل هنا أيضاً
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
    { field: 'username', headerName: 'Username', width: 180, editable: true,  headerAlign: 'center',
      align: 'center', },
    {
      field: 'email',
      headerName: 'Email',
      type: 'string',
      width: 200,
      align: 'left',
      headerAlign: 'left',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 220,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['admin', 'user'],
      headerAlign: 'center',
      align: 'center',
  
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
  
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              sx={{ color: 'primary.main' }}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              sx={{ color: 'black' }} />,
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
    width: '100%',
    height: 500,
    '& .MuiDataGrid-columnHeaders': {
      border: '2px solid #3f51b5',
      transition: 'border-color 0.3s ease',
    },
    '& .MuiDataGrid-cell': {
      border: '2px solid #e0e0e0',
      transition: 'border-color 0.3s ease',
      color: 'white',  // تعديل لون النص ليكون أبيض هنا
      fontWeight: 'bold',
      fontSize: 'large',
      boxShadow: '0 5px 15px rgba(25, 86, 5, 0.93)',
    },
    '& .MuiDataGrid-root:hover .MuiDataGrid-columnHeaders': {
      borderColor: '#blue',
    },
    '& .MuiDataGrid-root:hover .MuiDataGrid-cell': {
      borderColor: 'gray',
    },
    fontSize: 'xx-large',
    fontWeight: 'gray',
    '& .MuiDataGrid-columnHeaders': {
  border: '2px solid #3f51b5', 
  transition: 'border-color 0.3s ease',
  color: 'Darkred', // 👈 تغيير لون النص لعناوين الأعمدة إلى الأحمر (اختر اللون الذي تريده)
  fontWeight: 'bold', // 👈 جعل النص غامقًا
  fontSize: 'large', // 👈 تكبير حجم النص للعناوين
},

  }}
  
>
<div className="fab-container">
        <Fab color="red" aria-label="users" onClick={() => navigate('/')} className="fab-button" title="Admin page"
          sx={{color:'Darkblue'}}>
          <EngineeringSharpIcon />
        </Fab>
        </div>
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
    PaperProps={{ className: 'dialog-container-paper' }}
    >
    <DialogTitle id="responsive-dialog-title" className="dialogtext">
      Confirm Deletion
    </DialogTitle>
    <DialogContent>
      <DialogContentText className="dialogtext">
        Do you really want to delete this user?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={() => handleClose(false)} className="dialogtext">
        No🕴🏾
      </Button>
      <Button onClick={() => handleClose(true)} autoFocus className="dialogtext">
        🙋🏻‍♂️Yes👋🏻
      </Button>
    </DialogActions>
  </Dialog>
      </React.Fragment>
    </Box>
  );
}
