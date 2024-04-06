cd code/home-pi-be
git status
git pull origin main
git log --oneline --decorate -n 3
sudo systemctl restart mcanoy-be
sudo systemctl status mcanoy-be
# sudo journalctl -u mcanoy-be