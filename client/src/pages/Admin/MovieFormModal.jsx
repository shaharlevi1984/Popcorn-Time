import { useState } from 'react';
import { Grid, Modal, Form, Container, Segment, Button, Image } from 'semantic-ui-react'
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FormField from './FormField';
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';
import './style.css'

const MovieFormModal = ({ selectedCard, modalOpen, closeModal }) => {
    const [file, setFile] = useState('');
    const [FormState, setFormState] = useState({
        id: { value: '', required: true, missingData: true, maxLength: 20, error: '' },
        title: { value: '', required: true, missingData: true, maxLength: 50, error: '' },
        year: { value: '', required: true, pattern: /^\d{4}$/, error: '' },
        length: { value: '', required: true, missingData: true, pattern: /^\b\d{2,3}\s?min\b/, maxLength: 10, error: '' },
        rating: { value: '', required: true, missingData: true, min: 0, max: 10, error: '' },
        genres: { value: '', required: true, missingData: true, maxLength: 100, error: '' },
        directors: { value: '', required: true, missingData: true, maxLength: 50, error: '' },
        cast: { value: '', required: true, missingData: true, maxLength: 100, error: '' },
        plot: { value: '', required: true, missingData: true, maxLength: 200, error: '' },
        poster_path: { value: '', error: '' },
        subtitles: { value: '', error: '' },
        torrents: { value: '', error: '' },
    });

    const resetForm = () => {
        setFormState({
            id: { value: '', required: true, missingData: true, maxLength: 20, error: '' },
            title: { value: '', required: true, missingData: true, maxLength: 50, error: '' },
            year: { value: '', required: true, pattern: /^\d{4}$/, error: '' },
            length: { value: '', required: true, missingData: true, pattern: /^\b\d{2,3}\s?min\b/, maxLength: 10, error: '' },
            rating: { value: '', required: true, min: 0, max: 10, error: '' },
            genres: { value: '', required: true, missingData: true, maxLength: 100, error: '' },
            directors: { value: '', required: true, missingData: true, maxLength: 50, error: '' },
            cast: { value: '', required: true, missingData: true, maxLength: 100, error: '' },
            plot: { value: '', required: true, missingData: true, maxLength: 200, error: '' },
            poster_path: { value: '', error: '' },
            subtitles: { value: '', error: '' },
            torrents: { value: '', error: '' },
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

            setFormState((prevFormState) => ({
                ...prevFormState,
                id: {
                    value: prevFormState.id.value || movie.imdbID,
                    error: prevFormState.id.error || '',
                },
                title: {
                    value: prevFormState.title.value || movie.Title,
                    error: prevFormState.title.error || '',
                },
                year: {
                    value: prevFormState.year.value || movie.Year,
                    error: prevFormState.year.error || '',
                },
                length: {
                    value: prevFormState.length.value || movie.Runtime,
                    error: prevFormState.length.error || '',
                },
                rating: {
                    value: prevFormState.rating.value || movie.imdbRating,
                    error: prevFormState.rating.error || '',
                },
                genres: {
                    value: prevFormState.genres.value || movie.Genre,
                    error: prevFormState.genres.error || '',
                },
                directors: {
                    value: prevFormState.directors.value || movie.Director,
                    error: prevFormState.directors.error || '',
                },
                cast: {
                    value: prevFormState.cast.value || movie.Actors,
                    error: prevFormState.cast.error || '',
                },
                plot: {
                    value: prevFormState.plot.value || movie.Plot,
                    error: prevFormState.plot.error || '',
                },
            }));
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    };
    
    const inputChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: {
                ...prev[name],
                value
            }
        }))
    }

    const inputFileChangeHandler = (e) => {
        const files = e.target.files;

        setFormState(prevState => ({
            ...prevState,
            [e.target.name]: {
                ...prevState[e.target.name],
                value: files
            }
        }))
    }

    const searchMovieInDB = async () => {
        const serverUrl = `${import.meta.env.VITE_SERVER_URL}/${FormState.id.value}`;
        try {
            const response = await axios.get(serverUrl);
            const data = await response.json();
            return data
        } catch (error) {
            return error.response.status
        }
    };

    const onSuccess = async (data) => {
        if (data === 404) {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/addMovie`, FormState);
            toast.success('Movie has been successfully added to the database');
            closeModal();
        } else if (data === 200) {
            toast.error('Movie already exists in the database!');
        } else {
            toast.error('An unexpected error occurred!');
        }
    }

    const onError = async (data) => {
        toast.error('Submit Form Failed!')
    }

    const { mutate } = useMutation({
        mutationKey: ['movieId'],
        mutationFn: searchMovieInDB,
        onSuccess,
        onError,
    });

    const isRequired = value => {
        return Boolean(value);
    }
    const isMissingData = value => {
        return value.includes('N/A')
    }
    const maxLength = (value, maximum) => {
        return value <= maximum;
    }

    const pattern = (value, regex) => {
        return regex.test(value);
    }

    const inRange = (value, min, max) => {
        return value >= min && value <= max
    }

    const validate = (name, value) => {
        let errorMessage = '';

        if (FormState[name] && FormState[name].required && !isRequired(value)) {
            errorMessage = `${name} is required`;
        }

        else if (FormState[name] && FormState[name].missingData && isMissingData(value)) {
            errorMessage = `${name} missing data`;
        }

        else if (FormState[name] && FormState[name].pattern && !pattern(value, FormState[name].pattern)) {
            errorMessage = `${name} dosn't match to the pattern`;
        }

        else if (FormState[name] && FormState[name].maxLength && !maxLength(value)) {
            errorMessage = `${name} must be less than ${FormState[name].maxLength} characters`;
        }

        else if (FormState[name] && FormState[name].min && FormState[name].max && !inRange(value, FormState[name].min, FormState[name].max)) {
            errorMessage = `${name} dosn't match to the pattern`;
        }

        if (errorMessage) {
            setFormState(prev => ({
                ...prev,
                [name]: {
                    ...prev[name],
                    error: errorMessage
                }
            }))
        } else {
            setFormState(prev => ({
                ...prev,
                [name]: {
                    ...prev[name],
                    error: ''
                }
            }))
        }
    }

    const submitFormHandler = async (e) => {
        e.preventDefault();

        Object.keys(FormState).forEach(field => {
            validate(field, FormState[field].value);
        });

        mutate()
    }

    return (
        <Modal size='large' open={modalOpen} onClose={closeModal} >
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
                        <Form size='large' onSubmit={submitFormHandler} >
                            <Container style={{ marginTop: 10 }}>
                                <Segment>
                                    <Container textAlign="left">
                                        <Form.Group widths="equal">
                                            <FormField
                                                label='Movie Imdb Id'
                                                type='text'
                                                name='id'
                                                placeholder='movie imdb id'
                                                value={FormState.id.value || ''}
                                                onChange={inputChangeHandler}
                                                onBlur={validate}
                                                errors={FormState.id.error}
                                            />
                                            <FormField
                                                label='Movie Title'
                                                type='text'
                                                name='title'
                                                placeholder='movie title'
                                                value={FormState.title.value}
                                                onChange={inputChangeHandler}
                                                onBlur={validate}
                                                errors={FormState.title.error}
                                            />
                                            <FormField
                                                label='Movie Year'
                                                type='text'
                                                name='year'
                                                placeholder='movie year'
                                                value={FormState.year.value}
                                                onChange={inputChangeHandler}
                                                onBlur={validate}
                                                errors={FormState.year.error}
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
                                                placeholder='movie length'
                                                value={FormState.length.value}
                                                onChange={inputChangeHandler}
                                                onBlur={validate}
                                                errors={FormState.length.error}
                                            />
                                            <FormField
                                                label='Movie Rating'
                                                type='text'
                                                name='rating'
                                                placeholder='movie rating'
                                                value={FormState.rating.value}
                                                onChange={inputChangeHandler}
                                                min={0}
                                                max={10}
                                                step={0.1}
                                                onBlur={validate}
                                                errors={FormState.rating.error}
                                            />
                                            <FormField
                                                label='Movie Genres'
                                                type='text'
                                                name='genres'
                                                placeholder='movie genres'
                                                value={FormState.genres.value}
                                                onChange={inputChangeHandler}
                                                onBlur={validate}
                                                errors={FormState.genres.error}
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
                                                value={FormState.directors.value}
                                                onChange={inputChangeHandler}
                                                onBlur={validate}
                                                errors={FormState.directors.error}
                                            />
                                            <FormField
                                                label='Movie Cast'
                                                type='text'
                                                name='cast'
                                                placeholder='movie cast'
                                                value={FormState.cast.value}
                                                onChange={inputChangeHandler}
                                                onBlur={validate}
                                                errors={FormState.cast.error}
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
                                                value={FormState.plot.value}
                                                onChange={inputChangeHandler}
                                                onBlur={validate}
                                                errors={FormState.plot.error}
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
                                                onChange={inputFileChangeHandler}
                                                onBlur={validate}
                                                errors={FormState.poster_path.error}
                                            />
                                            <FormField
                                                label='Subtitles'
                                                type='file'
                                                name='subtitles'
                                                multiple
                                                onChange={inputFileChangeHandler}
                                                onBlur={validate}
                                                errors={FormState.subtitles.error}
                                            />
                                            <FormField
                                                label='Torrents'
                                                type='file'
                                                name='torrents'
                                                multiple
                                                onChange={inputFileChangeHandler}
                                                onBlur={validate}
                                                errors={FormState.torrents.error}
                                            />
                                        </Form.Group>
                                        <Button type="submit" color='green'> Submit </Button>
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