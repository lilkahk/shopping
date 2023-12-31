import './SideCart.css'
import PropTypes from 'prop-types'
import { XCircle } from 'lucide-react'
import Icon from '@mdi/react';
import { mdiCartOutline } from '@mdi/js';
import { Link, useLocation } from 'react-router-dom';
import { useContext, useMemo } from 'react';
import { CartContext } from '../Router';

function findSubstring(text, maxLength = 40) {
    const words = text.split(' ');
    let currentLength = 0;
    const resultWords = [];

    for (const word of words) {
        if (currentLength + word.length + resultWords.length > maxLength) {
            break;
        }
        resultWords.push(word);
        currentLength += word.length;
    }

    return resultWords.join(' ');
}

const SideCart = ({ closeCart }) => {

    const { cartItems } = useContext(CartContext)

    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            return total + item.price * item.quantity
        }, 0)
    }, [cartItems])

    return (
        <section className='side-cart'>
            <div>
                <div className="side-cart-header">
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        <Icon path={mdiCartOutline} size={1} data-testid='side-cart-icon' />
                        Your Cart
                    </div>
                    <XCircle onClick={() => closeCart(false)} 
                    className='close-side-cart' data-testid='close-side-cart'/>
                </div>
                <div className="side-cart-divider"></div>
            </div>
            <div style={{overflowY:'scroll', overflowX:'hidden', height:'100%'}}>
                {cartItems.map(({ url, alt, title, price, quantity }, idx) => {
                    return <CartItem key={idx} url={url} alt={alt} title={title}
                                price={price} quantity={quantity} />
                })}
            </div>
            <div style={{display:'flex', flexDirection:'column', paddingTop:'1rem'}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <p>SUB-TOTAL</p>
                    <p>$ {Math.round(subtotal * 100) / 100}</p>
                </div>
                <div className="side-cart-divider"></div>
                <Link to='/checkout'>
                    <button className={cartItems.length > 0 ? 'side-cart-checkout-btn' :
                        'side-cart-checkout-btn-invalid'}
                        onClick={(e) => {
                            cartItems.length > 0 ? closeCart(false) :
                            e.preventDefault()
                        }}
                    >
                        CHECKOUT
                    </button>
                </Link>
            </div>
            
        </section>
    )
}

SideCart.propTypes = {
    closeCart: PropTypes.func
}

export default SideCart

export const CartItem = ({ url, alt, title, price, quantity, setInvalid = undefined, msg = undefined }) => {
    
    const { addToCart, removeFromCart, cartItems } = useContext(CartContext)
    const { pathname } = useLocation()

    return (
        <section className='item'>
            <div style={{height:'100%', width:'100%', overflow:'hidden'}}>
                <img src={url} alt={alt} style={{height:'100%', width:'100%', objectFit:'contain', overflow:'hidden'}} />
            </div>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 2px'}}>
                    <h3 style={{fontSize:'0.8rem'}}>{findSubstring(title, 30)}</h3>
                    <p style={{fontSize:'0.8rem'}}>$ {Math.round(price * quantity * 100) / 100}</p>
                </div>
                <div style={{display:'flex', gap:'0.75rem', alignItems:'center'}}>
                    <button className='side-cart-quanity-btn' 
                        onClick={() => {
                          if (pathname === '/checkout' && setInvalid !== undefined) setInvalid(false)
                          addToCart(url, alt, title, price)
                        }}>
                        +
                    </button>
                    <p style={{width:'1ch'}}>{quantity}</p>
                    <button className='side-cart-quanity-btn'
                        onClick={() => {
                            if (pathname === '/checkout' && cartItems.length === 1 && cartItems[0].quantity === 1) {
                                if(setInvalid !== undefined) setInvalid(true)
                                if (msg !== undefined) msg('Must have at least one item at checkout')
                            } else {
                                removeFromCart(url, alt, title, price)
                            }
                        }}>
                        -
                    </button>
                    <button className='side-cart-remove-btn'
                        onClick={() => {
                            if (pathname === '/checkout' && cartItems.length === 1) {
                                if(setInvalid !== undefined) setInvalid(true)
                                if (msg !== undefined) msg('Must have at least one item at checkout')
                            } else {
                            removeFromCart(url, alt, title, price, Infinity)
                            }
                        }}>
                        Remove
                    </button>
                </div>
            </div>
        </section>
    )
}

CartItem.propTypes = {
    url: PropTypes.string,
    alt: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    setInvalid: PropTypes.func,
    msg: PropTypes.func
}