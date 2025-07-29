import { ConstructorPage, Feed, ForgotPassword, Login, NotFound404, Profile, ProfileOrders, Register } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { Route, Routes, useLocation } from 'react-router-dom';
import { MainLayout } from '../../layout/main-layout';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';
import { IngredientDetails } from '../ingredient-details';

const App = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  return (
    <div className={styles.app}>
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<ConstructorPage />} />
          <Route path='feed' element={<Feed/>} />
          <Route path='login' element={<Login/>}/>
          <Route path='register' element={<Register/>}/>
          <Route path='forgot-password' element={<ForgotPassword/>}/>
          <Route path='profile'>
            <Route index element={<Profile/>} />
            <Route path='orders' element={<ProfileOrders/>} />
          </Route>
          <Route path='feed/:number' element={<OrderInfo/>}/>
          <Route path='ingredients/:id' element={<IngredientDetails/>}/>
        </Route>
        <Route path='*' element={<NotFound404/>}/>
      </Routes>
      { backgroundLocation && 
      <Routes>
        <Route path='/feed/:number' element={<OrderInfo/>}/>
        <Route path='/ingredients/:id' element={<IngredientDetails/>}/>
        <Route path='/profile/orders/:number' element={<OrderInfo/>}/>
      </Routes>
      }
      
    </div>
  );
}

export default App;
