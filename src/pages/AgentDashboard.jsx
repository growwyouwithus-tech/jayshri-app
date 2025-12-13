import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  TrendingUp,
  People,
  Assignment,
  AttachMoney
} from '@mui/icons-material'
import axios from '../api/axios'
import toast from 'react-hot-toast'

const AgentDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    totalCommission: 0
  })

  useEffect(() => {
    fetchAgentData()
  }, [])

  const fetchAgentData = async () => {
    try {
      setLoading(true)
      // Fetch all bookings with high limit to get agent's bookings
      const { data } = await axios.get('/bookings?limit=10000')
      const allBookings = data.data || []
      
      // Filter bookings where current user is the agent
      const agentBookings = allBookings.filter(b => 
        b.agent?._id === user?._id || b.agent === user?._id
      )
      
      setBookings(agentBookings)
      
      // Calculate stats
      const totalCommission = agentBookings.reduce((sum, booking) => {
        // Check if booking has commissions array
        if (booking.commissions && Array.isArray(booking.commissions)) {
          const agentCommission = booking.commissions.find(c => 
            c.agent?._id === user?._id || c.agent === user?._id
          )
          return sum + (agentCommission?.amount || 0)
        }
        return sum
      }, 0)
      
      const stats = {
        totalBookings: agentBookings.length,
        pendingBookings: agentBookings.filter(b => b.status === 'pending').length,
        approvedBookings: agentBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length,
        totalCommission: totalCommission
      }
      
      setStats(stats)
    } catch (error) {
      console.error('Failed to fetch agent data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'confirmed': return 'success'
      case 'completed': return 'success'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pb: 4 }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3, mb: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" fontWeight="bold">
            Agent Dashboard
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Track your bookings and commissions
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Stats Cards */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {stats.totalBookings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Bookings
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <People sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {stats.pendingBookings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {stats.approvedBookings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Approved
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <AttachMoney sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  ₹{stats.totalCommission.toLocaleString('en-IN')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Commission
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Bookings */}
        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Recent Bookings
            </Typography>
            
            {bookings.length === 0 ? (
              <Alert severity="info">
                No bookings assigned to you yet. Contact your admin to get plot assignments.
              </Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Booking No.</strong></TableCell>
                      <TableCell><strong>Customer</strong></TableCell>
                      <TableCell><strong>Plot</strong></TableCell>
                      <TableCell><strong>Amount</strong></TableCell>
                      <TableCell><strong>Commission</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookings.slice(0, 10).map((booking) => {
                      const agentCommission = booking.commissions?.find(c => 
                        c.agent?._id === user?._id || c.agent === user?._id
                      )
                      
                      return (
                        <TableRow key={booking._id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {booking.bookingNumber || `#${booking._id.slice(-6)}`}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">
                              {booking.buyer?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.buyer?.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {booking.plot?.plotNumber}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.plot?.area} Sq.Ft
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              ₹{booking.totalAmount?.toLocaleString('en-IN')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600" color="success.main">
                              ₹{agentCommission?.amount?.toLocaleString('en-IN') || '0'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={booking.status} 
                              color={getStatusColor(booking.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString('en-IN')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default AgentDashboard
