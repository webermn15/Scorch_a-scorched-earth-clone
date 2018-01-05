# wdi-10-project-1
### Michael Weber's first project for General Assembly's Web Development Immersive program, cohort 10


Hosted on pages: (https://webermn15.github.io/wdi-10-project-1/)


***


# Scorch Clone
### Practical Questions!
##### What is this?
My project, Scorch Clone, is a 2 dimensional, multiplayer artillery simulation based somewhat on the classic DOS game Scorched Earth. Scorched Earth was itself remade in Java in the 90s under the title Scorch2000, and was hosted for upwards of 10 years on (http://www.Scorch2000.com). Scorch2000 was my first encounter with the genre, and I played it for years.


##### Why did I make it?
Before we were assigned the project, I read about several different technologies we weren't covering in class, and several Canvas projects I looked over piqued my interest. When, while thinking of ideas for what game I'd like to implement, I remembered Scorch2000, I brought up the site and found that the Java app no longer loaded. At that point, my decision was nearly made for me.


***


### User stories
##### A user can select how many players they would like to play 
Currently, the game allows between 2-4 players at once playing together on the same browser window, but the logic to scale is in place and I intend to implement firebase to allow for cross-browser online play.
##### A user can adjust their tanks' angle and power of fire
There is a static instructional p element that explains how to control your tanks' properties.
##### A user can see their tanks' angle and power of fire updated in real time
When adjusting their tank, there is a div that is updated at 60fps to display the current active tanks' properties, allowing the user controlling that tank to easily be able to track their current variables of fire. In addition, the tanks' barrel is animated, giving a rough visual representation of where they're aiming.
##### A user can restart the game when it ends
When a game ends, it's properties are reset, and they are again prompted to select the number of players for the next game. You don't have to refresh the page to start a new game.


***


### Technical Questions!
##### What technologies were used?
I used HTML5 Canvas, CSS, and Javascript to create this game. The majority of the project was writing Javascript that interacted with the HTML5 Canvas element, which I found moderately challenging but rewarding. Canvas has pretty good documentation! The second largest part of the project was DOM manipulation with Javascript- I can't imagine that clocked in at even 15% of code written.


##### How did I approach building Scorch Clone?
As with any time I'm faced with a new technology that I have only a rudimentary working knowledge of, I did a fair amount of reading and experimenting with simple properties and methods to understand how Canvas works before tackling even the smaller parts of the game logic. Before I began, I predicted my largest hurdle would come in the form of hit detection, so I searched and read and became super familiar with bitmapping using dataImage methods. Some of my biggest frustrations and proudest successes came from this aspect of building the game.


##### What problems did I face?
I struggled somewhat with developing some of the math used to animate the tank's barrel and track their projectile motion. In addition, animating the drawn lines of fire was something I truly wanted in this first release, but had to scrap because I was spending too much time trying to get it to work the way I'd have liked.



##### The only screenshot of Scorch2000 I can find
![alt text](http://www.scorch2000.com/docs/Image26.png "Scorch2000 screenshot")