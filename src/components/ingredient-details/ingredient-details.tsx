import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectIngredientById } from '../../services/features/ingredients/ingredients';
import { RootState } from '../../services/store';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const ingredientData = useSelector((state: RootState) => {
    const selector = selectIngredientById(id);
    return selector(state);
  });

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
