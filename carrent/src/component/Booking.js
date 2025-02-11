import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { getUserBookings } from '../back/api';

function UserReservations() {
    const [reservations, setReservations] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [reservationDate, setReservationDate] = useState('');
    const userId = sessionStorage.getItem('userId'); // استخراج userId المخزن عند تسجيل الدخول

    // useEffect(() => {
    //     if (userId) {
    //         getUserBookings(userId).then(setReservations);
    //     }
    // }, [userId]);

    const handleOpenDialog = (booking) => {
        setSelectedBooking(booking);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedBooking(null);
        setReservationDate('');
    };

    const handleConfirmReservation = () => {
        // إضافة منطق لحفظ الحجز، مثل إرسال التاريخ المحدد إلى الخادم
        console.log(`Car: ${selectedBooking.carId.name}, Date: ${reservationDate}`);
        setOpenDialog(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                حجوزات السيارات الخاصة بك
            </Typography>

            {reservations.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                    لا توجد حجوزات حتى الآن.
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>الصورة</TableCell>
                                <TableCell>اسم السيارة</TableCell>
                                <TableCell>السنة</TableCell>
                                <TableCell>السعر</TableCell>
                                <TableCell>تاريخ الحجز</TableCell>
                                <TableCell>الحالة</TableCell>
                                <TableCell>حجز</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations.map((booking) => (
                                <TableRow key={booking._id}>
                                    <TableCell>
                                        <Avatar src={booking.carId.image} variant="rounded" sx={{ width: 80, height: 60 }} />
                                    </TableCell>
                                    <TableCell>{booking.carId.name}</TableCell>
                                    <TableCell>{booking.carId.year}</TableCell>
                                    <TableCell>${booking.carId.price}</TableCell>
                                    <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{booking.status}</TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => handleOpenDialog(booking)}>
                                            حجز
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Dialog for reservation */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>تحديد تاريخ ووقت الحجز</DialogTitle>
                <DialogContent>
                    <TextField
                        label="تاريخ الحجز"
                        type="date"
                        fullWidth
                        value={reservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirmReservation} color="primary">
                        تأكيد
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UserReservations;
