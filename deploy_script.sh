cd code/home-pi-be
git status
git checkout swagger-output.json
git pull origin main
git log --oneline --decorate -n 3
sed -i 's/localhost/home-pi.local/g' swagger-output.json
npm install
sudo systemctl restart mcanoy-be
sudo systemctl status mcanoy-be
# sudo journalctl -u mcanoy-be

# add in pre pull a call to checkout swagger-out.json and sed -i localhost home-pi.local