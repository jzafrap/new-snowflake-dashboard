import React, { useState } from 'react';

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";


import ABI from './abi';
import "./fonts.css"
import { useGenericContract,useAccountEffect } from '../../common/hooks'
import { useWeb3Context } from 'web3-react'
import TransactionButton from '../../common/TransactionButton';




export default function WhatOptionYouPreferView1 ({ ein }) {
  
	const operatorAddress='0xd48c0379fF5888006fF6E1eA6bC45a23b75F5668'
	
	const context = useWeb3Context()
	
	const resolverContract = useGenericContract(operatorAddress, ABI)

		
	//logged user data
	const [totalVotes, setTotalVotes] = useState("000")
	const [totalRewards, setTotalRewards] = useState("000000")

	//current campaign data
	const [activeCampaigns, setActiveCampaigns] = useState([])
	const [currentCampaign, setCurrentCampaign] = useState(0)
	const [option1Text, setOption1Text] = useState("Fetching data...")
	const [option2Text, setOption2Text] = useState("Fetching data...")
	const [tipForParticipation, setTipForParticipation] = useState(0)
	const [title, setTitle] = useState("Fetching data...")
	const [status, setStatus] = useState(0);

	const [option1Percent,setOption1Percent] = useState(0)
	const [option2Percent,setOption2Percent] = useState(0)
	const [option1Votes,setOption1Votes] = useState(0)
	const [option2Votes,setOption2Votes] = useState(0)
	const [totalCampaignVotes,setTotalCampaignVotes] = useState(0)
	//
	const [showMode,setShowMode]=useState(0) //0 is show question, 1 is show response
	const [option,setOption] = useState(1)
	
	const [isLastCampaign,setIsLastCampaign] = useState(false);
  
	useAccountEffect(() => {
		debugger;
		refreshData();
		//getActiveCampaigns();
		

	})   
  
	function refreshData() {
		debugger;
		resolverContract.methods.getOwner(ein).call()
          .then(owner => {
			  debugger;
				setTotalVotes(owner.numPlayedGames)
				setTotalRewards(owner.earnedHydro)
				setCurrentCampaign(owner.currentCampaign)
				resolverContract.methods.campaigns(owner.currentCampaign).call()
					.then(camp =>{
						debugger;
						setOption1Text(camp.option1Description)
						setOption2Text(camp.option2Description)
						setTipForParticipation(camp.tipForParticipation)
						setTitle(camp.title)
						setStatus(camp.status)
						//resolverContract.methods.isLastCampaign(camp.id).call()
						//	.then(result => {		
						//		setIsLastCampaign(result);
						//		if(result){
						//			getStats();
						//			setShowMode(1);
						//		}
						//	});
					});
			});
	}
	
	function getStats() {
		debugger;
		resolverContract.methods.getStats().call()
          .then(stats => {
				debugger;
				setOption1Votes(stats.option1Votes)
				setOption2Votes(stats.option2Votes)
				setTotalCampaignVotes(stats.totalVotes)
				if(stats.totalVotes===0){
					setOption1Percent(0)
					setOption2Percent(0)
				}else{
					setOption1Percent(Math.round((stats.option1Votes*100)/stats.totalVotes))
					setOption2Percent(Math.round((stats.option2Votes*100)/stats.totalVotes))
				}								
		});
	}
	
	
	/**
	* This should show a modal dialog while sending txn to blockchain.
	* After TxDone, should show stats for current campaign:
	* - %option1 (nºvotes option1)
	* - %option2 (nºvotes option2)
	* - total votes
	* - hydro earned (if any)
	
	*/
	function handleOption1Click(){
		setOption(1);	
	}
	
	function handleOption2Click(){
		setOption(2);
	}
	
	//called after submit a response
	//	for results of currentCampaign, change mode to show
	function showResults(){
		debugger;
		refreshData();
		debugger;
		getStats();
		debugger;
		setShowMode(1);
	
	}
	
   return (
    <div>
      <div align="center" class="scorebar">
        
          Played {totalVotes} Times - {totalRewards} HYDRO earned
     
      </div>
      <div align="center" class="example">	 
          #{currentCampaign} {title}
		
        {showMode===0 && (
			<div class="example">
			What option do you prefer...?<br/>
			</div>
        )}
        {showMode===1 && (
			<div class="example" >
			  You prefer...
			</div>
        )}
      </div>
      <Grid
        container
        spacing="8"
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item>
		{showMode===0 && (
          <Button onClick={handleOption1Click} 
			class={option===1?"eightbit-btn eightbit-btn":"eightbit-btn eightbit-btn--discarted"}>
            <div class="vt323">{option1Text}</div>
          </Button>
		  )}
		  {showMode===1 && (
          <Button 
            class={option===1?"eightbit-btn eightbit-btn":"eightbit-btn eightbit-btn--discarted"}>
          
            <div class="vt323">{option1Text}</div>
            <div class="vt323">{option1Percent}% ({option1Votes} votes)</div>
          </Button>
        )}
        </Grid>
        <Grid>
          <div class="example">
            Or
          </div>
        </Grid>
        <Grid item>
		{showMode===0 && (
          <Button onClick={handleOption2Click} 
		   class={option===2?"eightbit-btn eightbit-btn":"eightbit-btn eightbit-btn--discarted"}>
         
            <div class="vt323"> {option2Text}</div>
          </Button>
		   )}
		   {showMode===1 && (
          <Button 
          class={option===2?"eightbit-btn eightbit-btn":"eightbit-btn eightbit-btn--discarted"}>
          
          
            <div class="vt323">{option2Text}</div>
            <div class="vt323">{option2Percent}% ({option2Votes} votes)</div>
          </Button>
        )}
        </Grid>
        <p>&nbsp;</p>
      </Grid>
      <div>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          {showMode===0 && (
			<>
			{tipForParticipation >0 && (
				<div class="example">
				Play for win {tipForParticipation} HYDRO!!
				</div>
			)}
				<TransactionButton
								class="scorebar"
								readyText='Submit ...'
								method = {() => resolverContract.methods.voteCampaign(ein,currentCampaign,option)}
								onConfirmation={() => showResults()}
				/>
			</>
			)}
			
          {showMode===1 && (
			  <>
				
				{!isLastCampaign? (
					<>
						{tipForParticipation >0 && (
						<div class="example">
							You won {tipForParticipation} HYDRO!!
						</div>
						)}
						<Button onClick={() => setShowMode(0)} class="eightbit-btn eightbit-btn--reset">&gt;</Button>
					</>
				):(
					
					<div class="example"	>
					You've reached last question! Come later, or create your own!
					</div>
				)}
			  </>
          )}
        {/*}
          <Button class="eightbit-btn eightbit-btn--reset">&lt;</Button>
          <Typography
            class="example"
            variant="h5"
            color="textPrimary"
            gutterBottom
          >
            #{currentCampaign}
          </Typography>
          <Button class="eightbit-btn eightbit-btn--reset">&gt;</Button>
          */}
		  </Grid>
      </div>
    </div>
  
 
  );
}







