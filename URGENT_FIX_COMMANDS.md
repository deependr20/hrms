# 🚨 URGENT FIX - nginx.ssl.conf is Corrupted on Server

## ⚠️ Problem
The `nginx.ssl.conf` file on your server has corrupted text in line 1, causing nginx to fail.

Error: `unexpected "e" in /etc/nginx/nginx.conf:1`

---

## 🚀 SOLUTION - Run These Commands on Server

### Option 1: Quick Fix (Recommended)

```bash
# Stop containers
cd /root/hrms
docker-compose down

# Backup corrupted file
cp nginx.ssl.conf nginx.ssl.conf.corrupted

# Fix the file by removing first line and recreating it
tail -n +2 nginx.ssl.conf > nginx.ssl.conf.temp
echo "events {" > nginx.ssl.conf.fixed
cat nginx.ssl.conf.temp >> nginx.ssl.conf.fixed
mv nginx.ssl.conf.fixed nginx.ssl.conf
rm nginx.ssl.conf.temp

# Start containers
docker-compose -f docker-compose.ssl.yml up -d

# Check logs
docker-compose logs nginx
```

---

### Option 2: Pull from GitHub (If I commit first)

```bash
# Stop containers
cd /root/hrms
docker-compose down

# Force pull from GitHub
git fetch origin main
git reset --hard origin/main

# Start containers
docker-compose -f docker-compose.ssl.yml up -d

# Check logs
docker-compose logs nginx
```

---

### Option 3: Manual Edit

```bash
# Edit the file
nano nginx.ssl.conf

# Delete the ENTIRE first line that has:
# "git add nginx.ssl.conf docker-compose.ssl.ymlgit commit -m "Server-specific SSL/nginx config"events {"

# Make sure the file starts with:
# events {
#     worker_connections 1024;
# }

# Save: Ctrl+O, Enter, Ctrl+X

# Restart
docker-compose down
docker-compose -f docker-compose.ssl.yml up -d
```

---

## ✅ After Fix - Verify

```bash
# Check nginx starts without errors
docker-compose logs nginx | tail -20

# Should NOT see "unexpected 'e'" errors

# Test HTTPS
curl -I https://zenova.sbs
```

---

## 📋 Copy-Paste Quick Fix (All Commands)

```bash
cd /root/hrms && \
docker-compose down && \
cp nginx.ssl.conf nginx.ssl.conf.corrupted && \
tail -n +2 nginx.ssl.conf > nginx.ssl.conf.temp && \
echo "events {" > nginx.ssl.conf.fixed && \
cat nginx.ssl.conf.temp >> nginx.ssl.conf.fixed && \
mv nginx.ssl.conf.fixed nginx.ssl.conf && \
rm nginx.ssl.conf.temp && \
docker-compose -f docker-compose.ssl.yml up -d && \
sleep 5 && \
docker-compose logs nginx | tail -20
```

---

**Run Option 1 (Quick Fix) now and let me know the output!** 🚀

