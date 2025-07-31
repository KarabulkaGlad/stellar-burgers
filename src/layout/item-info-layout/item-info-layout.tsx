import { AppHeader } from '@components';
import { Outlet } from 'react-router-dom';
import style from './item-info-layout.module.css';
export const ItemInfoLayout = () => (
  <>
    <AppHeader />
    <div className={style.content}>
      <Outlet />
    </div>
  </>
);
