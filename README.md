# Discourse Tagger Plugin

A plugin to allow users to attach labels (so called "tags") to their topics.

## Details


.To Note: this Plugins assumes tags are "moderated", meaning that only staff and users of the trust levels "leader" and "elder" are allowed to add new tags. Normal user can only pick from the list of pre-existing tags.

## Installation

### the official Docker


To install in docker, add the following to your app.yml in the plugins section:

```
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - git clone https://github.com/discourse/docker_manager.git
          - git clone https://github.com/werweisswas/discourse-plugin-tagger.git tagger
          - cp tagger/db/migrate/* db/migrate/
```

and rebuild docker via

```
cd /var/discourse
./launcher rebuild app
```

### Stand-alone

Just two easy steps. From your main discourse do:

    cd plugins
    git clone https://github.com/werweisswas/discourse-plugin-tagger.git tagger  # clone the repo here
    cd ..
    export RAILS_ENV=production                 # set to productions
    cp tagger/db/migrate/* db/migrate/          # copy migrations
    rake db:migrate                             # run migrations
    rake assets:precompile                      # precompile assets

## Changelog:

 * 2015-02-23:
   - fix migrations
   - add support docker instance

 * 2014-06-04
  - merge @eviltrout's plugin-outlet fixes.
  - add info to tags
  - add views and urls for more tags
  - add sidebar-cloud widgets

 * 2014-04-08
  - fix bug of missing tags after creating new topic
  - show composer tags only in desktop view for now, refs #1

 * 2014-03-18
  - first initial version launched

## TODO

(in order of importance)

 - switch to newly shipped Select2js


### other Limitations:


## Authors:
Benjamin Kampmann <me @ create-build-execute . com>

## License (BSD):
Copyright (c) 2014, wer-weis-was GmbH, Hamburg
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
