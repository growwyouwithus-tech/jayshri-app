import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { AccountCircle, Edit, Save, ChevronRight, Language, Lock, Info, Logout as LogoutIcon, Dashboard } from '@mui/icons-material'
import { List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material'
import { logout } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [editDialog, setEditDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const handleEditProfile = () => {
    setEditDialog(true)
  }

  const handleSaveProfile = () => {
    // Here you would call API to update profile
    toast.success('Profile updated successfully')
    setEditDialog(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header - Purple */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 4, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: 'white',
            color: 'primary.main',
            fontSize: '2.5rem',
            margin: '0 auto 16px',
            border: '4px solid rgba(255,255,255,0.2)',
            fontWeight: 600,
          }}
        >
          {user?.name?.charAt(0).toUpperCase() || 'V'}
        </Avatar>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ fontSize: '1.4rem' }}>
          {user?.name || 'vishnu sharma'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.95, fontSize: '0.9rem' }}>
          {user?.email || 'balag.rudra@gmail.com'}
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ py: 3, px: 2 }}>
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <List sx={{ p: 0 }}>
            {/* Show Dashboard button only for Agent role */}
            {user?.role === 'Agent' && (
              <>
                <ListItemButton sx={{ py: 2 }} onClick={() => navigate('/agent/dashboard')}>
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Box sx={{ bgcolor: '#C5E1A5', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Dashboard sx={{ color: '#689F38', fontSize: 24 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary="My Dashboard" 
                    primaryTypographyProps={{ fontWeight: 500, fontSize: '1rem' }}
                    secondary="View bookings & commission"
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                  <ChevronRight sx={{ color: '#999' }} />
                </ListItemButton>
                <Divider sx={{ mx: 2 }} />
              </>
            )}

            <ListItemButton sx={{ py: 2 }} onClick={handleEditProfile}>
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box sx={{ bgcolor: '#E1BEE7', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AccountCircle sx={{ color: 'primary.main', fontSize: 24 }} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Edit Profile" 
                primaryTypographyProps={{ fontWeight: 500, fontSize: '1rem' }}
              />
              <ChevronRight sx={{ color: '#999' }} />
            </ListItemButton>

            <Divider sx={{ mx: 2 }} />

            <ListItemButton sx={{ py: 2 }} onClick={() => navigate('/settings')}>
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box sx={{ bgcolor: '#B3E5FC', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Language sx={{ color: '#0288D1', fontSize: 24 }} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Language" 
                primaryTypographyProps={{ fontWeight: 500, fontSize: '1rem' }}
              />
              <Typography variant="body2" sx={{ color: '#999', mr: 1 }}>English</Typography>
              <ChevronRight sx={{ color: '#999' }} />
            </ListItemButton>

            <Divider sx={{ mx: 2 }} />

            <ListItemButton sx={{ py: 2 }} onClick={() => toast.info('Terms & Conditions coming soon')}>
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box sx={{ bgcolor: '#D1C4E9', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock sx={{ color: 'primary.main', fontSize: 24 }} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Terms & Conditions" 
                primaryTypographyProps={{ fontWeight: 500, fontSize: '1rem' }}
              />
              <ChevronRight sx={{ color: '#999' }} />
            </ListItemButton>

            <Divider sx={{ mx: 2 }} />

            <ListItemButton sx={{ py: 2 }} onClick={() => navigate('/contact')}>
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box sx={{ bgcolor: '#B3E5FC', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Info sx={{ color: '#0288D1', fontSize: 24 }} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="About Us" 
                primaryTypographyProps={{ fontWeight: 500, fontSize: '1rem' }}
              />
              <ChevronRight sx={{ color: '#999' }} />
            </ListItemButton>

            <Divider sx={{ mx: 2 }} />

            <ListItemButton sx={{ py: 2 }} onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box sx={{ bgcolor: '#FFE0B2', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LogoutIcon sx={{ color: '#F57C00', fontSize: 24 }} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ fontWeight: 500, fontSize: '1rem', color: '#F57C00' }}
              />
              <ChevronRight sx={{ color: '#999' }} />
            </ListItemButton>
          </List>
        </Card>

        {/* Edit Profile Dialog */}
        <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                disabled
                helperText="Email cannot be changed"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default Profile
