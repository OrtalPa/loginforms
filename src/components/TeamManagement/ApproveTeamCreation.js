import React, {useState, Component} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import {goBack} from '../Redirect/Redirect'

class ApproveTeamCreation extends Component{
    
    state = {
        teamsList : [],
        displayTeamsList : [],
        toApprove : "",
        successMessage : null
    };
    
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmitClick = this.handleSubmitClick.bind(this)
        this.getTeamsFromServer = this.getTeamsFromServer.bind(this)
        new Promise((resolved, rejected) => {
            try{
                var list;
                axios.get(API_BASE_URL+'teamsforapproval')
                    .then(function (response) {
                        if(response.status === 200){
                            console.log(response)
                            list = response.data
                        }
                    })
                    .then( () => {
                        this.setState(prevState => ({
                                        ...prevState,
                                        'teamsList' : list
                                    }))
                    })
                    .catch(function (error) {
                        console.log(error);
                        list = "";
                    })          
                var data  = this.getTeamsFromServer()       
                resolved(data) 

                // axios.get(API_BASE_URL+'teamsforapproval')
                // .then(function (response) {
                //     if(response.status === 200){
                //         console.log(response)
                //         //list = response.data
                //         this.setState(prevState => ({
                //             ...prevState,
                //             'teamsList' : response.data
                //         }))
                //         this.props.showError(null)
                //     }
                // })
                // .then(
                //     resolved(this.state.teamsList) 
                // )
                // .catch(function (error) {
                //     console.log(error);
                // })                
            } catch (e) {
                rejected(e)
            }
        })
        .then( result => {
            if (result){
                // approve the teams
                this.setState(prevState => ({
                    ...prevState,
                    'displayTeamsList' : result.map((team)=>{
                        return (
                            <div className="form-group">
                                <label>{team}</label>
                            </div>
                        );
                    })
                }))
              //  this.props.showError(null)

                // this.state.displayTeamsList = result.map((team)=>{
                //     return (
                //         <div className="form-group">
                //             <label>{team}</label>
                //         </div>
                //     );
                // })
            }
            else {
                // no teams for approval
                this.setState(prevState => ({
                    ...prevState,
                    'displayTeamsList' :  ['There are no teams to approve']
                }))
              //  this.props.showError(null)
            }
        })
        .catch(error => console.log(error))
    }

    handleChange(e){
        const {id , value} = e.target
        this.setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    getTeamsFromServer() {
        var list;
        axios.get(API_BASE_URL+'teamsforapproval')
            .then(function (response) {
                if(response.status === 200){
                    console.log(response)
                    list = response.data
                }
            })
            .then( () =>{
                return list
            })
            .catch(function (error) {
                console.log(error);
                list = "";
            })        
    }

    approveTeamInServer(teamName){
        axios.get(API_BASE_URL+'approveteam/'+teamName)
            .then(function (response) {
                if(response.status === 200){
                    this.setState(prevState => ({
                        ...prevState,
                        'successMessage' : response.data
                    }))
                    this.props.showError(null)
                } else{
                    this.props.showError(response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });   
    }
    
    handleSubmitClick(e){
        e.preventDefault();
        let a = this.state.toApprove
        let b =  this.state.teamsList
        if(a.length && b.some(item => this.state.toApprove === item)) {
            this.approveTeamInServer(this.state.toApprove)    
        } else {
            this.props.showError('Please enter a valid team name');
        }
    }

    render() {
        this.props.updateTitle('Approve teams')
      //  this.props.showError(null)
        // let teamsDisplay;
        // var listOfTeams;
        // new Promise((resolved, rejected) => {
        //     try{
        //         this.getTeamsFromServer()
        //         resolved(this.state.teamsList)
        //     } catch (e) {
        //         rejected("")
        //     }
        // })
        // .then( result => {
        // // calling the functions:
        // //setTimeout(()=> getTeamsFromServer(),10000)
        
        // if (result === ""){
        //     // no teams for approval
        //     teamsDisplay = 'There are no teams to approve'
        // }
        // else {
        //     // approve the teams
        //     //teamsDisplay = teams.teamsList
        //     let templist = result
        //     listOfTeams = templist.map((team)=>{
        //         return (
        //             <div className="form-group">
        //                 <label className="control-label">
        //                     {team}
        //                 </label>
        //             </div>
        //         );
        //     })
        // }
        // })
        return(
            <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
                <form>
                    <div className="form-group text-left">
                    <label className="row">Teams for approval:</label>
                    {/* <label>{teamsDisplay}</label> */}
                    {this.state.displayTeamsList}
                    </div>
                    <div className="form-group text-left">
                    <label>Enter team name to approve</label>
                    <input type="text"
                        className="form-control"
                        id="toApprove"
                        placeholder="Enter team name"
                        value={this.state.toApprove}
                        onChange={this.handleChange}
                    />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        onClick={this.handleSubmitClick}
                    >
                        Approve team
                    </button>
                </form>
                <div className="alert alert-success mt-2" style={{display: this.state.successMessage ? 'block' : 'none' }} role="alert">
                    {this.state.successMessage}
                </div>
                <div className="mt-2">
                    <span className="loginText" onClick={() => goBack()}>Back to menu</span> 
                </div>            
            </div>
        )
    }
}

// function ApproveTeamCreation(props) {
//     props.updateTitle('Approve teams')

//     // functions defenition:
//     const getTeamsFromServer = () => {
//         axios.get(API_BASE_URL+'teamsforapproval')
//             .then(function (response) {
//                 if(response.status === 200){
//                   //  console.log(response)
//                     setTeams(prevState => ({
//                         ...prevState,
                        
//                         'teamsList' : response.data
//                     }))
//                     props.showError(null)
//                 }
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     }

//     const [teams , setTeams] = useState({
//         teamsList : "",
//         toApprove : "",
//         successMessage : null
//     })
//     const handleChange = (e) => {
//         const {id , value} = e.target
//         setTeams(prevState => ({
//             ...prevState,
//             [id] : value
//         }))
//     }
//     const approveTeamInServer = (teamName) => {
//         axios.get(API_BASE_URL+'approveteam/'+teamName)
//             .then(function (response) {
//                 if(response.status === 200){
//                     setTeams(prevState => ({
//                         ...prevState,
//                         'successMessage' : response.data
//                     }))
//                     props.showError(null)
//                 } else{
//                     props.showError(response.data);
//                 }
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });   
//     }

//     const handleSubmitClick = (e) => {
//         e.preventDefault();
//         if(teams.toApprove.length && teams.teamsList.some(item => teams.toApprove === item)) {
//             approveTeamInServer(teams.toApprove)    
//         } else {
//             props.showError('Please enter a valid team name');
//         }
//     }

//     var listOfTeams;
//     new Promise((resolved, rejected) => {
//         try{
//             getTeamsFromServer()
//             resolved(teams.teamsList)
//         } catch (e) {
//             rejected("")
//         }
//     })
//     .then( result => {
//     // calling the functions:
//     //setTimeout(()=> getTeamsFromServer(),10000)
    
//         if (result === ""){
//             // no teams for approval
//             listOfTeams = 'There are no teams to approve'
//         }
//         else {
//             // approve the teams
//             //teamsDisplay = teams.teamsList
//             let templist = result
//             listOfTeams = templist.map((team)=>{
//                 return (
//                     <div className="form-group">
//                         <label className="control-label">
//                             {team}
//                         </label>
//                     </div>
//                 );
//             })
//         }
//     })
//     let teamsDisplay;
    
//     // calling the functions:
//     setTimeout(()=> getTeamsFromServer(),10000)
    
//     if (teams.teamsList === ''){
//         // no teams for approval
//         teamsDisplay = 'There are no teams to approve'
//     }
//     else {
//         // approve the teams
//         //teamsDisplay = teams.teamsList
//         var listOfTeams = teams.teamsList.map((team)=>{
//             return (
//                 <div className="form-group">
//                     <label className="control-label">
//                         {team}
//                     </label>
//                 </div>
//             );
//         })
//     }

//     return(
//         <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
//             <form>
//                 <div className="form-group text-left">
//                 <label className="row">Teams for approval:</label>
//                 {/* <label>{teamsDisplay}</label> */}
//                 {listOfTeams}
//                 </div>
//                 <div className="form-group text-left">
//                 <label>Enter team name to approve</label>
//                 <input type="text"
//                     className="form-control"
//                     id="toApprove"
//                     placeholder="Enter team name"
//                     value={teams.toApprove}
//                     onChange={handleChange}
//                 />
//                 </div>
//                 <button 
//                     type="submit" 
//                     className="btn btn-primary"
//                     onClick={handleSubmitClick}
//                 >
//                     Approve team
//                 </button>
//             </form>
//             <div className="alert alert-success mt-2" style={{display: teams.successMessage ? 'block' : 'none' }} role="alert">
//                 {teams.successMessage}
//             </div>
//             <div className="mt-2">
//                 <span className="loginText" onClick={() => goBack()}>Back to menu</span> 
//             </div>            
//         </div>
//     )
// }

export default withRouter(ApproveTeamCreation);