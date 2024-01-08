import { useState } from 'react';
import { Grid, Modal, Form, Container, Segment, Button, Image } from 'semantic-ui-react'
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FormField from './FormField';
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';

const MovieFormModal = ({ selectedCard, modalOpen, closeModal }) => {
    const [FormState, setFormState] = useState({
        id: '',
        title: '',
        year: '',
        length: '',
        rating: 0,
        genres: '',
        directors: '',
        cast: '',
        plot: '',
        poster_path: '',
        subtitles: '',
        torrents: '',
    });

    const resetForm = () => {
        setFormState({
            id: '',
            title: '',
            year: '',
            length: '',
            rating: 0,
            genres: '',
            directors: '',
            cast: '',
            plot: '',
            poster_path: '',
            subtitles: '',
            torrents: '',
        });
    };

    const movieDetails = async (title) => {
        // console.log("Title submitted:", title);
        const apiUrl = import.meta.env.VITE_OMDB_MOVIE_DETAILS;
        const apiKey = import.meta.env.VITE_OMDB_API_KEY;
        const response = await fetch(`${apiUrl}${apiKey}&t=${title}&plot=full`);
        const data = await response.json();
        return data;
    };

    const formAutoFill = async (e, title) => {
        try {
            const movie = await movieDetails(title);
            // console.log(movie);
            setFormState((prevFormState) => ({
                ...prevFormState,
                id: prevFormState.id || movie.imdbID,
                title: prevFormState.title || movie.Title,
                year: prevFormState.year || movie.Year,
                length: prevFormState.length || movie.Runtime,
                rating: prevFormState.rating || parseFloat(movie.imdbRating),
                genres: prevFormState.genres || movie.Genre,
                directors: prevFormState.directors || movie.Director,
                cast: prevFormState.cast || movie.Actors,
                plot: prevFormState.plot || movie.Plot,
                poster_path: prevFormState.poster_path || movie.Poster,
            }));
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    };

    const inputChangeHandler = (e) => {
        setFormState({
            ...FormState,
            [e.target.name]: e.target.value,
        });
    };

    const searchMovieInDB = async () => {
        const serverUrl = `${import.meta.env.VITE_SERVER_URL}/${FormState.id}`;
        try {
            const response = await axios.get(serverUrl);
            const data = await response.json();
            return data
        } catch (error) {
            return { status: 404 };
        }
    };

    const onSuccess = async () => {
        toast.error('Movie already exists in the database!');
    }

    const onError = async (error) => {
        if(error.status === 404) {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/addMovie`,FormState)
        toast.error('Movie not found in database')
        closeModal();
        }
    }
    const { mutate } = useMutation({
        mutationKey: ['movieId'],
        mutationFn: searchMovieInDB,
        onSuccess,
        onError,
    });

    const submitFormHandler = async () => {
        await mutate()
    };

    return (
        <Modal size='large' open={modalOpen} onClose={closeModal} onSubmit={() => submitFormHandler()}>
            <Modal.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>Movie Details Form</div>
                <Button color='black' onClick={() => {
                    closeModal();
                    resetForm();
                }}>
                    Close
                </Button>
            </Modal.Header>
            <Modal.Content>
                <Grid columns={4} stackable centered verticalAlign="top" padded='vertically'>
                    <Grid.Column width={4}>
                        {selectedCard && (
                            <Image
                                src={selectedCard.medium_cover_image}
                                size="large"
                                centered
                                onClick={(event) => {
                                    formAutoFill(event, selectedCard.title_english);
                                }}
                            />
                        )}
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Form size='large' onSubmit={submitFormHandler}>
                            <Container style={{ marginTop: 10 }}>
                                <Segment>
                                    <Container textAlign="left">
                                        <Form.Group widths="equal">
                                            <FormField
                                                label='Movie Imdb Id'
                                                type='text'
                                                name='id'
                                                placeholder='movie imdb id'
                                                value={FormState.id}
                                                onChange={inputChangeHandler}
                                            />
                                            <FormField
                                                label='Movie Title'
                                                type='text'
                                                name='title'
                                                placeholder='movie title'
                                                value={FormState.title}
                                                onChange={inputChangeHandler}
                                            />
                                            <FormField
                                                label='Movie Year'
                                                type='number'
                                                name='year'
                                                placeholder='movie year'
                                                value={FormState.year}
                                                onChange={inputChangeHandler}
                                            />
                                        </Form.Group>
                                    </Container>
                                </Segment>
                                <Segment >
                                    <Container textAlign="left">
                                        <Form.Group widths="equal">
                                            <FormField
                                                label='Movie Length'
                                                type='text'
                                                name='length'
                                                placeholder='movie title'
                                                value={FormState.length}
                                                onChange={inputChangeHandler}
                                            />
                                            <FormField
                                                label='Movie Rating'
                                                type='number'
                                                name='rating'
                                                placeholder='movie rating'
                                                value={FormState.rating}
                                                onChange={inputChangeHandler}
                                                min={0}
                                                max={10}
                                                step={0.1}
                                            />
                                            <FormField
                                                label='Movie Genres'
                                                type='text'
                                                name='genres'
                                                placeholder='movie genres'
                                                value={FormState.genres}
                                                onChange={inputChangeHandler}
                                            />
                                        </Form.Group>
                                    </Container>
                                </Segment>
                                <Segment>
                                    <Container textAlign="left">
                                        <Form.Group widths="equal">
                                            <FormField
                                                label='Movie Directors'
                                                type='text'
                                                name='directors'
                                                placeholder='movie directors'
                                                value={FormState.directors}
                                                onChange={inputChangeHandler}
                                            />
                                            <FormField
                                                label='Movie Cast'
                                                type='text'
                                                name='cast'
                                                placeholder='movie cast'
                                                value={FormState.cast}
                                                onChange={inputChangeHandler}
                                            />
                                        </Form.Group>
                                    </Container>
                                </Segment>
                                <Segment>
                                    <Container textAlign="left">
                                        <Form.Group widths="equal">
                                            <FormField
                                                label='Movie Plot'
                                                type='textarea'
                                                name='plot'
                                                placeholder='plot...'
                                                value={FormState.plot}
                                                onChange={inputChangeHandler}
                                            />
                                        </Form.Group>
                                    </Container>
                                </Segment>
                                <Segment >
                                    <Container textAlign="left" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Form.Group widths="equal">
                                            <FormField
                                                label='Movie Poster'
                                                type='file'
                                                name='poster_path'
                                                onChange={inputChangeHandler}
                                            />
                                            <FormField
                                                label='Subtitles'
                                                type='file'
                                                name='subtitles'
                                                multiple
                                                onChange={inputChangeHandler}
                                            />
                                            <FormField
                                                label='Torrents'
                                                type='file'
                                                name='torrents'
                                                multiple
                                                onChange={inputChangeHandler}
                                            />
                                        </Form.Group>
                                        <Button type="submit" color='green'>Submit</Button>
                                    </Container>
                                </Segment>
                            </Container>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Modal.Content>
        </Modal>
    )
}

export default MovieFormModal