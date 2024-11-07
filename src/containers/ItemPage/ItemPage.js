import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCart } from '../../Redux/CartSlice.js';
import { getToken, addToCart } from '../../utils/auth.js';
import Loader from '../../components/Loader/Loader.js';
import Header from '../Header/Header.js';
import { getImageSrc } from '../../components/card_item/CardItem.js';
import './ItemPage.css';

function ItemPage() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('red');
  const [amount, setAmount] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/cards/${id}`)
      .then(response => {
        const cardData = response.data;
        setCard(cardData);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleAddToCart = async () => {
    try {
      const response = await axios.patch('/api/update-stock', {
        id: card.id,
        color: selectedColor,
        amount: -amount
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (response.data.success) {
        let updatedCart;
        const existingItemIndex = cart.findIndex(item => item.id === card.id && item.color === selectedColor);

        if (existingItemIndex !== -1) {
          updatedCart = cart.map((item, index) => 
            index === existingItemIndex ? { ...item, quantity: item.quantity + amount } : item
          );
        } else {
          updatedCart = [...cart, { ...card, color: selectedColor, quantity: amount }];
        }

        dispatch(setCart(updatedCart));

        const token = getToken();
        if (token) {
          await addToCart(updatedCart);
        }

        // Оновлення стану card для зменшення stockAmount
        setCard(prevCard => ({
          ...prevCard,
          stock: prevCard.stock.map(stockItem =>
            stockItem.color === selectedColor
              ? { ...stockItem, amount: stockItem.amount - amount }
              : stockItem
          )
        }));

        alert('Item added to cart');
      } else {
        alert('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error loading item</div>;
  }

  const stockAmount = card?.stock.find(stockItem => stockItem.color === selectedColor)?.amount || 0;
  const imageSrc = (imgpath) => getImageSrc(imgpath);

  return (
    <div>
      <Header />
      <div className='itempage__main'>
        <div className='main__info'>
          {card && <img src={imageSrc(card.imgpath)} alt={card.title} />}
          <div className='main__info__right'>
            <article>
              <h1>{card?.title}</h1>
              <p>{card?.text}</p>
            </article>
            <h3>In stock: {stockAmount}</h3>
            <div className="main__info-selects">
              <div className="main__info-selects__count">
                <p>Amount:</p>
                <input
                  id="content__cost"
                  type="number"
                  min={stockAmount === 0 ? 0 : 1}
                  max={stockAmount}
                  className="content__cost-input"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <div className="main__info-selects__color">
                <p>Color:</p>
                <select
                  id="content__color"
                  className="content__color-select"
                  value={selectedColor}
                  onChange={handleColorChange}
                >
                  {card?.stock.map(stockItem => (
                    <option key={stockItem.color} value={stockItem.color}>
                      {stockItem.color.charAt(0).toUpperCase() + stockItem.color.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className='main__price-buttons'>
          <div className="main__price">
            <p className="main__price-price">Price:</p>
            <p>$ {card?.price}</p>
          </div> 
          <div className='buttons'>
            <Link to='/catalog'> 
              <button className='buttons_go_back'>Go back</button>
            </Link>
            <button className='buttons_add_to_cart' onClick={handleAddToCart}>Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemPage;