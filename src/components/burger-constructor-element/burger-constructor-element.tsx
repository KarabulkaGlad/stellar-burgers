import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveOneStepIngredienInOrder,
  removeIngredientFromOrder
} from '../../services/features/user-order/user-order';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const handleMoveDown = () => {
      dispatch(moveOneStepIngredienInOrder({ ingredient, direction: 'down' }));
    };

    const handleMoveUp = () => {
      dispatch(moveOneStepIngredienInOrder({ ingredient, direction: 'up' }));
    };

    const handleClose = () => {
      dispatch(removeIngredientFromOrder(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
