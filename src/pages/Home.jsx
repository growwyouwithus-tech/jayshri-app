import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  TrendingUp,
  ArrowForward,
  LocationOn,
  Home as HomeIcon,
} from '@mui/icons-material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { fetchProperties } from '../store/slices/propertySlice'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { properties, loading } = useSelector((state) => state.property)
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Get API URL for images
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL.replace('/api/v1', '')}${path}`
  }

  useEffect(() => {
    dispatch(fetchProperties())
  }, [dispatch, isAuthenticated]) // Re-fetch when auth status changes

  // Ensure properties is always an array
  const propertiesArray = Array.isArray(properties) ? properties : []

  // Debug logging
  useEffect(() => {
    console.log('🏠 Home: Properties data updated:', {
      count: propertiesArray.length,
      isAuthenticated,
      properties: propertiesArray.map(p => ({ name: p.name, images: p.media?.moreImages?.length || 0 }))
    })
  }, [propertiesArray, isAuthenticated])

  const featuredProperties = propertiesArray.slice(0, 6) // Show more properties in slider

  const handlePropertyClick = (property) => {
    navigate(`/properties/${property._id}`)
  }

  const handleRefreshData = () => {
    console.log('🔄 Manually refreshing properties data...')
    dispatch(fetchProperties())
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Auto-Scroll Property Slider */}
      <Box sx={{ height: { xs: 250, md: 450 }, position: 'relative' }}>
        {loading ? (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: '#f0f0f0'
          }}>
            <CircularProgress />
          </Box>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            style={{ height: '100%' }}
          >
            {featuredProperties.map((property, index) => (
              <SwiperSlide key={property._id || index}>
                <Box
                  onClick={() => handlePropertyClick(property)}
                  sx={{
                    height: '100%',
                    backgroundImage: `url(${getImageUrl(property.media?.mainPicture) || getImageUrl(property.media?.moreImages?.[0]) || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
                    }
                  }}
                >
                  {/* Property Info Overlay */}
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 20, 
                    left: 20, 
                    right: 20, 
                    zIndex: 1,
                    color: 'white'
                  }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                      {property.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">
                        {property.address || property.city?.name || 'Location'}
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      ₹{property.basePricePerGaj?.toLocaleString()}/gaj
                    </Typography>
                  </Box>
                  
                  {/* Location Icon */}
                  <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
                    <IconButton 
                      sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                      onClick={() => {
                        // Check if property has coordinates
                        if (property.coordinates?.latitude && property.coordinates?.longitude) {
                          const url = `https://maps.google.com/?q=${property.coordinates.latitude},${property.coordinates.longitude}`;
                          window.open(url, '_blank');
                        } else if (property.address) {
                          // Fallback to address search
                          const url = `https://maps.google.com/?q=${encodeURIComponent(property.address)}`;
                          window.open(url, '_blank');
                        } else {
                          // Fallback to city search
                          const url = `https://maps.google.com/?q=${encodeURIComponent(property.city?.name || 'Location')}`;
                          window.open(url, '_blank');
                        }
                      }}
                    >
                      <LocationOn sx={{ color: 'primary.main' }} />
                    </IconButton>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>


      {/* Debug Info Section */}
      {/* <Box sx={{ bgcolor: '#f0f0f0', px: 2, py: 1, borderBottom: '1px solid #ddd' }}>
        <Typography variant="caption" sx={{ color: '#666' }}>
          Debug: {propertiesArray.length} properties loaded | Auth: {isAuthenticated ? '✅' : '❌'} | 
          <Button size="small" onClick={handleRefreshData} sx={{ ml: 1, minWidth: 'auto', p: 0.5 }}>
            🔄 Refresh
          </Button>
        </Typography>
      </Box> */}

      {/* All Properties Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, md: 4 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', md: '1.75rem' } }}>
            All Properties ({propertiesArray.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* <Button
              onClick={() => navigate('/test-connection')}
              variant="outlined"
              size="small"
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                fontSize: '0.8rem',
                color: '#FF5722',
                borderColor: '#FF5722'
              }}
            >
              Test API
            </Button> */}
            <Button
              onClick={() => navigate('/colonies')}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'primary.main'
              }}
            >
              See All
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : propertiesArray.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <HomeIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Properties Available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please check back later or contact admin
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleRefreshData}
              sx={{ textTransform: 'none' }}
            >
              Refresh
            </Button>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {featuredProperties.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property._id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }
                }}
                onClick={() => handlePropertyClick(property)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height={isMobile ? "160" : "200"}
                    image={getImageUrl(property.media?.mainPicture) || getImageUrl(property.media?.moreImages?.[0]) || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'}
                    alt={property.name}
                    sx={{
                      objectFit: 'cover',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.3s ease'
                      }
                    }}
                  />
                  {/* Status Badge */}
                  <Chip
                    label={property.status === 'ready_to_sell' ? 'Ready to Sell' : 'Available'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: '#4CAF50',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
                <CardContent sx={{ p: { xs: 2, md: 2.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1" fontWeight={600} gutterBottom noWrap sx={{ fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
                    {property.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <LocationOn 
                      sx={{ 
                        fontSize: 16, 
                        color: '#666',
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' }
                      }}
                      onClick={() => {
                        // Check if property has coordinates
                        if (property.coordinates?.latitude && property.coordinates?.longitude) {
                          const url = `https://maps.google.com/?q=${property.coordinates.latitude},${property.coordinates.longitude}`;
                          window.open(url, '_blank');
                        } else if (property.address) {
                          // Fallback to address search
                          const url = `https://maps.google.com/?q=${encodeURIComponent(property.address)}`;
                          window.open(url, '_blank');
                        } else {
                          // Fallback to city search
                          const url = `https://maps.google.com/?q=${encodeURIComponent(property.city?.name || 'Location')}`;
                          window.open(url, '_blank');
                        }
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#666', 
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                      }} 
                      noWrap
                      onClick={() => {
                        // Check if property has coordinates
                        if (property.coordinates?.latitude && property.coordinates?.longitude) {
                          const url = `https://maps.google.com/?q=${property.coordinates.latitude},${property.coordinates.longitude}`;
                          window.open(url, '_blank');
                        } else if (property.address) {
                          // Fallback to address search
                          const url = `https://maps.google.com/?q=${encodeURIComponent(property.address)}`;
                          window.open(url, '_blank');
                        } else {
                          // Fallback to city search
                          const url = `https://maps.google.com/?q=${encodeURIComponent(property.city?.name || 'Location')}`;
                          window.open(url, '_blank');
                        }
                      }}
                    >
                      {property.address || property.city?.name || 'Premium Location'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1.5 }}>
                    <Chip
                      label="Residential"
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: 24, 
                        fontSize: '0.7rem',
                        borderRadius: 5,
                        borderColor: '#999'
                      }}
                    />
                    {/* Show all categories */}
                    {(property.categories && property.categories.length > 0 
                      ? property.categories 
                      : [property.category || 'Residential']
                    ).map((cat, catIdx) => (
                      <Chip
                        key={catIdx}
                        label={cat}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          height: 24, 
                          fontSize: '0.7rem',
                          borderRadius: 5,
                          borderColor: '#999'
                        }}
                      />
                    ))}
                    <Chip
                      label={`Amenities: ${property.amenities?.length || 0}`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: 24, 
                        fontSize: '0.7rem',
                        borderRadius: 5,
                        borderColor: '#999'
                      }}
                    />
                    <Chip
                      label={`Facilities: ${property.facilities?.length || 0}`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: 24, 
                        fontSize: '0.7rem',
                        borderRadius: 5,
                        borderColor: '#999'
                      }}
                    />
                  </Box>
                  
                  {/* Price Information */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ color: 'primary.main', fontSize: '1rem' }}>
                        ₹{property.basePricePerGaj?.toLocaleString() || '5,000'}/gaj
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {property.totalLandAreaGaj?.toLocaleString() || 0} Gaj Total
                      </Typography>
                    </Box>
                    <Chip
                      icon={<TrendingUp sx={{ fontSize: 14 }} />}
                      label="Hot Deal"
                      size="small"
                      sx={{
                        bgcolor: '#FF5722',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForward sx={{ fontSize: 18 }} />}
                    sx={{
                      bgcolor: 'primary.main',
                      borderRadius: 2,
                      py: { xs: 1, md: 1.25 },
                      fontWeight: 600,
                      fontSize: { xs: '0.85rem', md: '0.95rem' },
                      textTransform: 'none',
                      mt: 'auto',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default Home
