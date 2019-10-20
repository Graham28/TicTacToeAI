import numpy as np
import copy
import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt

class Board:
  
  #initilizes class
  def __init__(self, size):
    self.size = size
    self.board = np.zeros((self.size,self.size,3))
    self.winner = 2 #2 represents a draw 0 => O wins 1 => X wins
    self.board_list = []

  def getBoard(self):
    return self.board

  def getWinner(self):
    return self.winner
  
  def getBoardList(self):
    return self.board_list

  def clearBoard(self):
    self.board = np.zeros((self.size,self.size,3))
  
  def xMove(self,x_pos,y_pos):
    if self.board[x_pos][y_pos][2] == 0:
      self.board[x_pos][y_pos][2] = 1
      self.board[x_pos][y_pos][0] = 1
      return True
    else:
      return False
    
  def oMove(self,x_pos,y_pos):
    if self.board[x_pos][y_pos][2] == 0:
      self.board[x_pos][y_pos][2] = 1
      self.board[x_pos][y_pos][1] = 1
      return True
    else:
      return False
  
  def playRandomMoveX(self):
    possible_moves = []
    for i in range(self.size):
      for j in range(self.size):
        if self.board[i][j][2] == 0:
          possible_moves.append([i,j])

    move = possible_moves[np.random.randint(len(possible_moves))]
    self.xMove(move[0],move[1])
    

  def playRandomMoveO(self):
    possible_moves = []
    for i in range(self.size):
      for j in range(self.size):
        if self.board[i][j][2] == 0:
          possible_moves.append([i,j])

    move = possible_moves[np.random.randint(len(possible_moves))]
    self.oMove(move[0],move[1])

  def playRandomGame(self):
    for i in range(9):
      if i%2 == 0:
        self.playRandomMoveX()
      else:
        self.playRandomMoveO()
      current = copy.deepcopy(self.getBoard())
      #print(current)
      self.board_list.append(current)
      #print(self)
      #print(self.board_list)

      if self.checkWin():
        self.clearBoard()
        break
      elif i == 8:
        self.clearBoard()
        
  def generateRandomGames(self,num_games):
    data = []
    results = []
    for i in range(num_games):
      self.playRandomGame()
      data.append(self.getBoardList())
      for i in range(len(self.getBoardList())):
        results.append(self.getWinner())
      self.winner = 2
      self.board_list = []
    
    return (data,results)
    
  
  def checkWin(self):
    if np.array_equal(self.board[0][0],self.board[0][1]) and np.array_equal(self.board[0][1],self.board[0][2]) and self.board[0][2][2] == 1:
      self.winner = int(self.board[0][2][0])#will be 0 if o is here, 1 if x is here
      return True
    if np.array_equal(self.board[1][0],self.board[1][1]) and np.array_equal(self.board[1][1],self.board[1][2]) and self.board[1][2][2] == 1:
      self.winner = int(self.board[1][2][0])#will be 0 if o is here, 1 if x is here
      return True
    if np.array_equal(self.board[2][0],self.board[2][1]) and np.array_equal(self.board[2][1],self.board[2][2]) and self.board[2][2][2] == 1:
      self.winner = int(self.board[2][2][0])#will be 0 if o is here, 1 if x is here
      return True
    if np.array_equal(self.board[0][0],self.board[1][0]) and np.array_equal(self.board[1][0],self.board[2][0]) and self.board[2][0][2] == 1:
      self.winner = int(self.board[2][0][0])#will be 0 if o is here, 1 if x is here
      return True
    if np.array_equal(self.board[0][1],self.board[1][1]) and np.array_equal(self.board[1][1],self.board[2][1]) and self.board[2][1][2] == 1:
      self.winner = int(self.board[2][1][0])#will be 0 if o is here, 1 if x is here
      return True
    if np.array_equal(self.board[0][2],self.board[1][2]) and np.array_equal(self.board[1][2],self.board[2][2]) and self.board[2][2][2] == 1:
      self.winner = int(self.board[2][2][0])#will be 0 if o is here, 1 if x is here
      return True
    if np.array_equal(self.board[0][0],self.board[1][1]) and np.array_equal(self.board[1][1],self.board[2][2]) and self.board[2][2][2] == 1:
      self.winner = int(self.board[2][2][0])#will be 0 if o is here, 1 if x is here
      return True
    if np.array_equal(self.board[0][2],self.board[1][1]) and np.array_equal(self.board[1][1],self.board[2][0]) and self.board[2][0][2] == 1:
      self.winner = int(self.board[2][0][0])#will be 0 if o is here, 1 if x is here
      return True
    
    return False

  def buildModel(self, num_games):
    (boards,train_labels) = self.generateRandomGames(num_games)
    train_boards = []
    for boards_list in boards:
      for board in boards_list:
        train_boards.append(board)
        
    train_boards = np.array([board for board in train_boards])
    train_labels = np.array([result for result in train_labels])

    model =keras.Sequential([
    keras.layers.Flatten(input_shape=(3,3,3)),
    keras.layers.Dense(128,activation="relu"),
    keras.layers.Dense(128,activation="relu"),
    keras.layers.Dense(3, activation="softmax"),
    ])

    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])

    model.fit(train_boards, train_labels, epochs=5) 

    self.model = model

  def playMachineMoveX(self):
    possible_moves = []
    move_boards = []
    for i in range(self.size):
      for j in range(self.size):
        if self.board[i][j][2] == 0:
          possible_moves.append([i,j])
    
    copy_board = copy.deepcopy(self.board)

    for move in possible_moves:
      self.xMove(move[0],move[1])
      move_boards.append(copy.deepcopy(self.board))
      self.board = copy.deepcopy(copy_board)
    
    best_move = 0
    val = 1
    predictions = self.model.predict(np.array([board for board in move_boards]),batch_size=10)
    for i in range(len(predictions)):
      if predictions[i][0]-predictions[i][1] < val:
        val = predictions[i][0]-predictions[i][1]
        best_move = i
    
    self.xMove(possible_moves[best_move][0],possible_moves[best_move][1])

  def playMachineMoveO(self):
    possible_moves = []
    move_boards = []
    for i in range(self.size):
      for j in range(self.size):
        if self.board[i][j][2] == 0:
          possible_moves.append([i,j])
    
    copy_board = copy.deepcopy(self.board)

    for move in possible_moves:
      self.oMove(move[0],move[1])
      move_boards.append(copy.deepcopy(self.board))
      self.board = copy.deepcopy(copy_board)
    
    best_move = 0
    val = -1
    predictions = self.model.predict(np.array([board for board in move_boards]),batch_size=10)
    for i in range(len(predictions)):
      if predictions[i][0]-predictions[i][1] > val:
        val = predictions[i][0]-predictions[i][1]
        best_move = i
    
    self.oMove(possible_moves[best_move][0],possible_moves[best_move][1])


  def playMachineGame(self,random_chance):
    self.clearBoard()
    for i in range(9):
        if i%2 == 0:
          if np.random.random() <random_chance:
            self.playRandomMoveX()
          else:
            self.playMachineMoveX()
        else:
          if np.random.random() < random_chance:
            self.playRandomMoveO()
          else:
            self.playMachineMoveO()
          print(self)
        
        current = copy.deepcopy(self.getBoard())
        self.board_list.append(current)
        
        if self.checkWin():
          self.clearBoard()
          break
        elif i == 8:
          self.clearBoard()
    
  def playMachineGame2(self,level):
    self.clearBoard()
    random_chance = 1
    for i in range(9):
        if i%2 == 0:
          if np.random.random() <random_chance:
            self.playRandomMoveX()
          else:
            self.playMachineMoveX()
        else:
          if np.random.random() < random_chance:
            self.playRandomMoveO()
          else:
            self.playMachineMoveO()
        if i > level and level > 0:
          level -= 0.2
        
        current = copy.deepcopy(self.getBoard())
        self.board_list.append(current)
        
        if self.checkWin():
          self.clearBoard()
          break
        elif i == 8:
          self.clearBoard()

  def generateMachineGames2(self,num_games,level):
    data = []
    results = []
    for i in range(num_games):
      self.playMachineGame2(level)
      data.append(self.getBoardList())
      for j in range(len(self.getBoardList())):
        results.append(self.getWinner())
      self.winner = 2
      self.board_list = []
    
    return (data,results)

  def generateMachineGames(self,num_games,random_chance):
    data = []
    results = []
    for i in range(num_games):
      self.playMachineGame(random_chance)
      data.append(self.getBoardList())
      for j in range(len(self.getBoardList())):
        results.append(self.getWinner())
      self.winner = 2
      self.board_list = []
    
    return (data,results)

  def reBuildModel(self, num_games,level):
    print('playing games..')
    (boards,train_labels) = self.generateMachineGames2(num_games,level)
    train_boards = []
    for boards_list in boards:
      for board in boards_list:
        train_boards.append(board)
        
    train_boards = np.array([board for board in train_boards])
    train_labels = np.array([result for result in train_labels])

    model =keras.Sequential([
    keras.layers.Flatten(input_shape=(3,3,3)),
    keras.layers.Dense(128,activation="relu"),
    keras.layers.Dense(128,activation="relu"),
    keras.layers.Dense(3, activation="softmax"),
    ])

    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])

    model.fit(train_boards, train_labels, epochs=5) 

    self.model = model
    
    


  def fullTrain(self,games_per_round):
    self.buildModel(games_per_round)
    self.reBuildModel(games_per_round,7)
    self.reBuildModel(games_per_round,6)
    self.reBuildModel(games_per_round,4)
    self.reBuildModel(games_per_round,2)
    self.reBuildModel(games_per_round,0)
      
  
        

  
  def __str__(self):
    output = ""
    for i in range(self.size):
      for j in range(self.size):
        if self.board[j][i][0] == 1:
          output += " X "
        elif self.board[j][i][1] == 1:
          output += " O "
        else:
          output += " _ "
      output += "\n"


    return output
