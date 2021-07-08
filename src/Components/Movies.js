import React, { Component } from "react";
//import { getMovies } from "./MovieService";
import axios from 'axios';
import "./App.css";
import style1 from "./App.module.css"


export default class Movies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movies:[],
            currSearchText: "",
            currentPage: 1,
            limit: 3,
        };
    }

    async componentDidMount(){
        console.log("componentDidMount");
        let promise=axios.get("https://backend-react-movie.herokuapp.com/movies");
        let data1=await promise;
        console.log(data1.data.movies);
        this.setState({
            movies:data1.data.movies
        })
    }

    onDelete = (id) => {
        let filterArr = this.state.movies.filter((movieObj) => {
            return movieObj._id != id;
        });
        this.setState({
            movies: filterArr,
        });
    };
    handleChange = (e) => {
        let val = e.target.value;
        this.setState({
            currSearchText: val,
        });

        //We are kind of creating two states for similar content. As the filter movies operation is temporary and occurs with the state change
        //  of currSearchText we can simply form the filterMovies array in the render method itself. So there is no need to make
        // it as a state.
        // if(val=='')
        // {
        //     this.setState({
        //     filterMovies:this.state.movies,
        //     currSearchText:''
        // })
        // return;
        // }
        // let filteredArr = this.state.movies.filter(movieObj=>{
        //     let title = movieObj.title.trim().toLowerCase();
        //     // console.log(title);
        //     return title.includes(val.toLowerCase());
        // })
        // this.setState({
        //     filterMovies:filteredArr,
        //     currSearchText:val
        // })
    };

    sortByRatings = (e) => {
        let className = e.target.className;
        console.log(className);
        let sortedArr = [];
        if (className == "fa fa-sort-asc") {
            //sort in ascending order
            //a-b used for sorting in ascending order
            sortedArr = this.state.movies.sort((movieA, movieB) => {
                return movieA.dailyRentalRate - movieB.dailyRentalRate;
            });
        } else {
            //sort in descending order
            //b-a is used for sorting in descending order
            sortedArr = this.state.movies.sort((movieA, movieB) => {
                return movieB.dailyRentalRate - movieA.dailyRentalRate;
            });
        }

        this.setState({
            movie: sortedArr,
        });
    };

    sortByStock = (e) => {
        let className = e.target.className;
        let sortedArr = [];

        if (className == "fa fa-sort-asc") {
            sortedArr = this.state.movies.sort((movieA, movieB) => {
                return movieA.numberInStock - movieB.numberInStock;
            });
        } else {
            sortedArr = this.state.movies.sort((movieA, movieB) => {
                return movieB.numberInStock - movieA.numberInStock;
            });
        }

        this.setState({
            movies: sortedArr,
        });
    };

    handlePageChange= (pageNumber) => {
        console.log("handle changed called:",pageNumber);
        this.setState({
            currentPage:pageNumber
        })
    }

    handleLimit = (e) => {
        let val = Number(e.target.value);
        this.setState({
            limit: val,
        });
    };

    render() {
        console.log("render");

        let { movies, currSearchText, limit, currentPage } = this.state;
        let filterMovies = [];

        //filtering the array to imlement searching
        if (currSearchText != "") {
            filterMovies = movies.filter((movieObj) => {
                let title = movieObj.title.trim().toLowerCase();
                // console.log(title);
                return title.includes(currSearchText.toLowerCase());
            });
        } else {
            filterMovies = movies;
        }

        //implementing pagination

        let numberOfPages=Math.ceil(filterMovies.length/limit);
        let pageNumberArr=[];
        for(let i=1;i<=numberOfPages;i++){
            pageNumberArr.push(i);
        }

        let si = (currentPage - 1) * limit;
        let ei = si + limit;
        filterMovies = filterMovies.slice(si, ei);

        //  INLINE CSS

        const loader={
            position:'absolute',
            top:'50%',
            left:'50%'
        }

        

        return (
            <>
            {
            this.state.movies.length==0 ?
                <div style={loader} className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
                </div>

            :<div  className="container">
                <img src={process.env.PUBLIC_URL+"/images/movie.jpg"} alt="mypic" className="rounded-circle" alt="Cinque Terre"></img>
                <div className="row">
                    <div className="col-3">
                        <h1>Hello</h1>
                    </div>
                    <div className="col-9">
                        <input className={style1.searchBox} placeholder=" type movie name........!" onChange={this.handleChange} type="text"></input>
                        <input
                            className="perPage"
                            type="Number"
                            value={
                                this.state.limit > filterMovies.length
                                    ? filterMovies.length
                                    : limit
                            }
                            min="1"
                            max={movies.length}
                            onChange={this.handleLimit}
                        ></input>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Title</th>
                                    <th scope="col">Genre</th>
                                    <th scope="col">
                                        <i
                                            className="fa fa-sort-asc"
                                            onClick={this.sortByStock}
                                        ></i>
                                        Stock
                                        <i
                                            className="fa fa-sort-desc"
                                            onClick={this.sortByStock}
                                        ></i>
                                    </th>
                                    <th scope="col">
                                        <i
                                            className="fa fa-sort-asc"
                                            onClick={this.sortByRatings}
                                        ></i>
                                        Rate
                                        <i
                                            className="fa fa-sort-desc"
                                            onClick={this.sortByRatings}
                                        ></i>
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filterMovies.map((movieObj) => (
                                        <tr scope="row" key={movieObj._id}>
                                            <td>{movieObj.title}</td>
                                            <td>{movieObj.genre.name}</td>
                                            <td>{movieObj.numberInStock}</td>
                                            <td>{movieObj.dailyRentalRate}</td>
                                            <td>
                                                <button
                                                    onClick={() => this.onDelete(movieObj._id)}
                                                    type="button"
                                                    className="btn btn-danger"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        <nav aria-label="...">
                            <ul className="pagination">
                                {/* <li class="page-item">
                                    <a class="page-link" href="#">
                                        1
                                    </a>
                                </li>
                                <li class="page-item active" aria-current="page">
                                    <span class="page-link">2</span>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">3</a>
                                </li> */}

                                {
                                    //creating li of number of pages using map
                                    pageNumberArr.map(pageNumber=>{

                                        let classStyleName=pageNumber==currentPage ? 'page-item active':'page-item';

                                        return(
                                            <li onClick={()=>this.handlePageChange(pageNumber)} className={classStyleName} key={pageNumber}>
                                                 <span className="page-link">{pageNumber}</span>
                                            </li>
                                        )
                                    })
                                }



                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
    }
            </>
        );
    }
}
