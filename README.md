# IQ180  

All information here are subject to change.  

Frontend/UI: React Framework  
Backend/Server: NodeJS  
Frontend and Backend will be connected with Socket.IO  

Members:  
Frontend: Thas, David, Minerva, Black  
Backend: Matt, Thame  

**Term Project Submission on November 3rd and 10th**  

**TO Start Server** NO LONGER NEEDED TO CD INTO FOLDER!  

npm start  

**TO Start Client**  NO LONGER NEEDED TO CD INTO FOLDER!  
  
npm run dev  

**Requirement Checklist**  

Score Criteria (Full score = 25 points)  
a) (5.0) Demo preparation and creativity  
b) (10.0) Fundamental implementation  
c) (10.0) Extra features  

IQ180 (Fundamental implementation)  
Implement server to pair the client.  
- [X] (0.5) One of computer has server program and also game client.  
- [X] (0.5) Another computer has only game client that will directly connect to server.  
  
Client  
- [X] (1.0) Client connects to server first and gets information about other clients from server program.  
- [X] (1.0) Each client knows what server’s address and server’s port are. Server’s IP and port will be set in your program’s source code.  
- [X] (0.5) Can put your nickname when the game starts.  
- [X] (0.5) Welcome message appears on the game starts.  
- [X] (0.5) Player’s name and score are appeared on the game client.  
- [X] (0.5) Player cannot see anything until his/her turn.  
- [X] (0.5) Time can be counted down.  
- [X] (0.5) Every chosen digit has to be disabled.  
- [X] (0.5) The equation has to be checked.  
- [X] (0.5) Increase a score when the equation has been solved.
  
Server  
- [X] (1.0) Server program shows the number of concurrent clients that are online.  
- [X] (1.0) Server has a reset button to reset player’s scores and current game.  
- [X] (1.0) Server randomizes the five digits and the final result when the game starts and also randomizes the first player for the first game.
  
Extra features (1.0 per feature)

- [X] Feature 1: How to play screen
- [X] Feature 2: Leaderboard
- [X] Feature 3: Support for multiple rooms.
- [X] Feature 4: Singleplayer
- [X] Feature 5: Change the number of numbers (Default needs to be 5 numbers according to the original assignment.)
- [X] Feature 6: Change the game's timer.
- [X] Feature 7: Change the order of operations used in the game.
- [X] Feature 8: Change the amount of attempts allowed on each equation.
- [X] Feature 9: Displays answer for each round on the server's interface.
- [X] Feature 10: Can reset individual room on the server instead of the entire server. (?)
