# PML-TQ Web

Fronted web application for [PML-TQ server](https://github.com/ufal/perl-pmltq-server).  

Currently work in progress...

## Development

Node environment, Gulp and Bower is required.

1. Install Node (skip if you have Node installed)
    
        curl https://raw.githubusercontent.com/creationix/nvm/v0.24.1/install.sh | bash
        nvm install stable
        nvm use stable

2. Install Gulp & Bower
        
        npm install -g gulp
        npm install -g bower

3. Clone repository
    
        git clone https://github.com/ufal/perl-pmltq-web.git
        cd perl-pmltq-web
        npm install
        bower install

4. Start development server
    
        gulp serve

5. Run you own PML-TQ server or tunnel one from euler or euler-dev (if you have ssh access) 

		ssh -t -L 9090:127.0.0.1:9090 euler-dev or euler.ms.mff.cuni.cz

6. For TDD run

		gulp tdd