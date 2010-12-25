    Mata Framework

    -- Additional Stuff for Sproutcore

#Adding Mata to Your SproutCore Project

To add Mata to your SproutCore project, start by acquiring the framework from github:

    $ cd <your sproutcore project's root directory>
    $ mkdir frameworks # if you don't already have a frameworks folder
    $ cd frameworks
    $ git clone git://github.com/FrozenCanuck/Mata.git mata
  
Once acquired, you then need to update your project's `Buildfile` file. This can be done like so:

    config :all, :required => [:sproutcore, :mata]
  
Congrats! You're now on your way to using Mata.