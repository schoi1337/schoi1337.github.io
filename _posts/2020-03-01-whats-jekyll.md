---
layout: post
title: What's Jekyll?
date: 2020-03-01
categories: archive
---

[Jekyll](https://jekyllrb.com) is a static site generator, an open-source tool for creating simple yet powerful websites of all shapes and sizes. From [the project's readme](https://github.com/jekyll/jekyll/blob/master/README.markdown):

# h1
code block test
```sh
#!/bin/bash

# Greet user and request their name
echo "The activity generator"
read -p "What is your name? " name

# Create an array of activities
activity[0]="Football"
activity[1]="Table Tennis"
activity[2]="8 Ball Pool"
activity[3]="PS5"
activity[4]="Blackjack"

array_length=${#activity[@]} # Store the length of the array
index=$(($RANDOM % $array_length)) # Randomly select an index from 0 to array_length

# Invite the user to join you participate in an activity
echo "Hi" $name, "would you like to play" ${activity[$index]}"?"
read -p "Answer: " answer
```

> Jekyll is a simple, blog aware, static site generator. It takes a template directory [...] and spits out a complete, static website suitable for serving with Apache or your favorite web server. This is also the engine behind GitHub Pages, which you can use to host your project’s page or blog right here from GitHub.

It's an immensely useful tool. Find out more by [visiting the project on GitHub](https://github.com/jekyll/jekyll).
