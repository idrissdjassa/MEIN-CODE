import * as React from 'react';
import Grid from '@mui/material/Grid'; // Importing Grid
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { red } from "@mui/material/colors";
import DeleteIcon from '@mui/icons-material/Delete';
import {articlesInitiale} from "./constante";
import {useState} from "react";
import 
import { Link as RouterLink } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';  // Import de useNavigate
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Markdown from 'react-markdown'
import CustomBreadcrumb from "./CustomBreadcrumb";
import {Pagination, TextField} from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import {toast} from "react-toastify";





export default function ArticleList() {
    const [articles, setArticles] = useState(articlesInitiale)
    const [currentArticle, setCurrentArticle] = useState(null); // Pour l'édition
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();  // Utilisation de useNavigate pour la navigation
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    // Function to sort articles by title
    const sortArticles = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        const sortedArticles = [...articles].sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            if (titleA < titleB) return sortOrder === 'asc' ? -1 : 1;
            if (titleA > titleB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setArticles(sortedArticles);
        setSortOrder(newSortOrder);
    };



    // Filtrer les articles en fonction de la recherche dans le titre et le contenu
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredArticles.slice(indexOfFirstPost, indexOfLastPost);


    // Gestion du changement de recherche
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };





    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Change page
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    // Calculate total pages
    const pageCount = Math.ceil(articles.length / postsPerPage);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const addAndUpdateArticle = (article) => {
        if (article.id) {
            // Mise à jour d'un article existant
            setArticles(articles.map(a => (a.id === article.id ? article : a)));
            setAnchorEl(null);

        } else {
            // Ajout d'un nouvel article
            setArticles([...articles, {...article, id: Date.now()}]);
        }
        setCurrentArticle(null);
    };
    const deleteArticle = (id) => {
        setArticles(articles.filter(article => article.id !== id));
        toast.success("Delete successfully!");
        setAnchorEl(null);

    };



    return (
        <Box>
            <CustomBreadcrumb title="Post"/>

            <Grid container spacing={3} sx={{ padding: 10, margin: 'auto', maxWidth: 1650, justifyContent: 'flex-start' }}>
                <Grid item xs={12} >
                    <Box display="flex" justifyContent="flex-start" alignItems="center" gap="10px">
                        {/* Premiers éléments alignés à gauche */}
                        <ArticleForm addArticle={addAndUpdateArticle} editArticleData={currentArticle}/>
                        <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
                            Retour au Dashboard
                        </Button>

                        {/* Élément pour pousser les éléments suivants vers la droite */}
                        <Box flexGrow={1} />

                        {/* Derniers éléments, également alignés à gauche mais après un espace */}
                        <TextField
                            label="Search"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            sx={{
                                flexGrow: 1,
                                maxWidth: 250,
                                '& .MuiInputBase-root': {
                                    height: 35, // Keep the height minimal
                                },
                                '& .MuiOutlinedInput-input': {
                                    padding: '8px 12px', // Smaller padding for a more minimalistic design
                                    fontSize: '0.875rem', // Smaller font size
                                },
                                '& .MuiInputLabel-root': {
                                    transform: 'translate(14px, 9px) scale(1)', // Adjust to fit the reduced padding
                                },
                                '& .MuiInputLabel-shrink': {
                                    transform: 'translate(14px, -6px) scale(0.75)', // Adjust for focused state
                                }
                            }}
                        />
                        <Button onClick={sortArticles}>
                            <SortIcon/>
                        </Button>
                    </Box>
                </Grid>
                {currentPosts.map(article => (
                    <Grid item xs={12} sm={6} md={3} key={article.id}>

                        <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
                            <CardMedia
                                component="img"
                                height="240"
                                image={article.imgUrl}
                                alt={article.title}
                                sx={{ filter: 'brightness(0.75)' }} // Darken image for better text visibility
                            />
                            <CardHeader
                                title={article.title}
                                subheader={<Markdown>{article.content}</Markdown>}
                                titleTypographyProps={{ variant: 'h6' }}
                                subheaderTypographyProps={{ variant: 'body2' }}
                                sx={{
                                    textAlign: 'left',
                                    paddingBottom: '0px',
                                }}
                            />

                            <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTimeIcon sx={{ mr: 0.5 }} />
                                    {formatDate(article.creationDate)}
                                </Typography>

                                <IconButton aria-label="more options" onClick={handleClick}>
                                    <MoreVertIcon />
                                </IconButton>

                                <Menu
                                    id="demo-positioned-menu"
                                    aria-labelledby="demo-positioned-button"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    <MenuItem onClick={handleClose} component={RouterLink} to={`/articles/${article.id}`}>
                                        <VisibilityIcon sx={{ marginRight: 1 }} /> Voir
                                    </MenuItem>
                                    <MenuItem> <ArticleForm addArticle={addAndUpdateArticle} editArticleData={article}/>Modifier</MenuItem>
                                    <MenuItem onClick={handleClose}><IconButton aria-label="supprimer" onClick={()=> deleteArticle(article.id)}>
                                        <DeleteIcon sx={{ color: red[500] }}/>
                                    </IconButton>Supprimer</MenuItem>
                                </Menu>

                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                {currentPosts.length === 0 && (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center' }}>
                            No posts available in this category.
                        </Box>
                    </Grid>
                )}
            </Grid>

            {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Pagination count={pageCount} page={currentPage} onChange={handleChangePage} />
                </Box>
            )}
        </Box>
    );

}
