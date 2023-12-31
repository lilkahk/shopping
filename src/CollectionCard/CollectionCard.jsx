import './CollectionCard.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const CollectionCard = ({ url, name, link }) => {

    return (
        <section>
            <Link to={link} className='collection-card'>
                <div className='collection-card-top'>
                    <img src={url} alt={`Image for the ${name}'s collection`} />
                </div>
                <h3>{name}</h3>
            </Link>
        </section>
    )
}

CollectionCard.propTypes = {
    url: PropTypes.string,
    name: PropTypes.string,
    link: PropTypes.string
}

export default CollectionCard