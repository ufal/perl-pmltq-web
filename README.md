# PML-TQ Web

Fronted web application for [PML-TQ server](https://github.com/ufal/perl-pmltq-server).

Currently work in progress...

## Development

Node environment and Bower is required.

1. Install Node (skip if you have Node installed)

        curl https://raw.githubusercontent.com/creationix/nvm/v0.24.1/install.sh | bash
        nvm install stable
        nvm use stable

2. Install Bower

        npm install -g bower

3. Clone repository

        git clone https://github.com/ufal/perl-pmltq-web.git
        cd perl-pmltq-web
        npm install
        bower install

4. Install dependencies

        make install

5. Run you own PML-TQ server or tunnel one from euler or euler-dev (if you have ssh access)

        ssh -t -L 3000:127.0.0.1:9090 euler-dev or euler.ms.mff.cuni.cz

6. Run webpack-dev-server

        make run

7. Open browser

        http://localhost:8080/webpack-dev-server/

## Deploy

TODO: move this to wiki

1. Clean and build

        gulp clean && gulp build

2. Rsync to euler-dev

        rsync --verbose  --progress --stats --recursive dist/* pmltq@euler-dev:/opt/pmltq-web

  - Use `--delete` if you need clean deployment directory


## Contact

**Report a bug**: [issue tracker](https://github.com/ufal/perl-pmltq-web/issues)

**Questions**: pmltq at ufal.mff.cuni.cz