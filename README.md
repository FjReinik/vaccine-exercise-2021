# vaccination-exercise

Issues with 

# The exercise

Make a web application for presenting some interesting data about the vaccinations.

Return the exercise as a link to your GitHub repository.

## Technology choices

Feel free to use whatever you think is best for this kind of stuff.

React/Vue.js/Angular or something else for the web frontend. All is fine.

Swift/Kotlin/React Native/Flutter etc. or a mobile technology of your choice.

Node.js/Clojure/Go/Rust/Kotlin or something else for the backend.

Some kind of database could be useful for aggregating the data. MySQL/Postgresql/Oracle/FreemanDB or maybe noSQL?

## List of interesting things

For given day like 2021-04-12T11:10:06

* How many orders and vaccines have arrived total?
* How many of the vaccinations have been used?
* How many orders/vaccines per producer?
* How many bottles have expired on the given day (remember a bottle expires 30 days after arrival)
* How many vaccines expired before the usage -> remember to decrease used injections from the expired bottle
* How many vaccines are left to use?
* How many vaccines are going to expire in the next 10 days?

Perhaps there is some other data which could tell us some interesting things?

## Some numbers to help you

* Total number of orders 5000
* Vaccinations done 7000
* "2021-03-20" arrived 61 orders.
* When counted from "2021-04-12T11:10:06.473587Z" 12590 vaccines expired before usage (injections in the expiring bottles 17423
  and injections done from the expired bottles 4833)

## Some tips

* You don't need to do all these for a good result.
* You can make graphs from the data but textual representation suffice also.
* Think about the tests for your application.
* You can test the frontend also
* Add README.md which have instructions how to build/run your software and how to run the tests.
