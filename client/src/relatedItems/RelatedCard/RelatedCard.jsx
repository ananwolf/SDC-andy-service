import React, { useState, useEffect, useContext } from 'react';
import CompareModal from '../CompareModal/CompareModal.jsx';
import { MdStarBorder } from 'react-icons/md';
import StarsRating from 'stars-rating';
import { ThemeContext } from '../../App.jsx';

const RelatedCard = ({ product, productId, setProductId, getStarRating, getDefaultStyle }) => {
  const [defaultStyle, setDefaultStyle] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const imageURL = product.styles.results[0].photos[0].thumbnail_url;
  const darkTheme = useContext(ThemeContext);


  useEffect(() => {
    (async () => {
      let style = await getDefaultStyle(product);
      setDefaultStyle(style);
      let starRating = await getStarRating(product.overview.id);
      setAverageRating(starRating);
    })();
  }, [product]);

  const handleRelatedCardClick = async () => {
    await setProductId(product.overview.id);
    document.getElementById('header').scrollIntoView();
  };

  return (
    <div className='card-container' data-testid={`related-${product.overview.id}`}>
      <MdStarBorder className='action-btn'
        style={{color: darkTheme ? '#fff' : '#000', backgroundColor: darkTheme ? '#000' : '#fff'}}
        onClick={() => setModalOpen(true)}/>
      <CompareModal open={modalOpen} productId={productId} relatedProduct={product} onClose={() => setModalOpen(false)}/>
      <div className='card-inner-container'onClick={() => handleRelatedCardClick()}>
        <div className='card-item'>
          <img loading='lazy' className='card-image' alt='related-card' src={imageURL !== null ? imageURL : 'https://bit.ly/2Tg8g4s'}></img>
        </div>
        <div className='card-item text category'>{product.overview.category.toUpperCase()}</div>
        <div className='card-item text name'>{product.overview.name}</div>
        { defaultStyle.sale_price ?
          <div className='card-item text price'>
            <p style={{color: 'red'}}>${defaultStyle.sale_price}</p>
            <p style={{textDecoration: 'line-through'}}>${defaultStyle.original_price}</p>
          </div>
          : <div className='card-item text'>${defaultStyle.original_price}</div>
        }
        <div className='card-item text rating'>
          <StarsRating count={5} value={averageRating} half={true} edit={false} />
        </div>
      </div>
    </div>
  );
};

export default RelatedCard;