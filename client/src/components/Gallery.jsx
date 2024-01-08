import { useState } from "react";
import { Card, Grid } from "semantic-ui-react";
import { DisplayTypes } from "../pages/Admin";
import GalleryPagination from "./Pagination";

const Gallery = ({ data, displayType, onCardClick,activePage, totalPages, onPageChange }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    onCardClick(card); 
  };

  return (
    <>
       <GalleryPagination activePage={activePage} totalPages={totalPages}
       onPageChange={(e, { activePage }) => onPageChange(activePage)} />

      <Grid columns={5} stackable centered verticalAlign="top" padded="vertically">
        {data.map((item) => (
          <Grid.Column key={item.id}>
            <Card.Group>
              <Card
                fluid
                image={
                  displayType === DisplayTypes.Movies
                    ? item.medium_cover_image
                    : `https://image.tmdb.org/t/p/original/${item.poster_path}`
                }
                onClick={() => handleCardClick(item)} // Pass the clicked card to the handler
              />
            </Card.Group>
          </Grid.Column>
        ))}
      </Grid>

      <GalleryPagination activePage={activePage} totalPages={totalPages}
       onPageChange={(e, { activePage }) => onPageChange(activePage)} />
    </>
  );
};

export default Gallery;
