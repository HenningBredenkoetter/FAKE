@echo off
git pull
git fetch upstream
git checkout master
git merge upstream/master
git push