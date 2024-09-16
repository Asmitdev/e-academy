require('dotenv').config();
const Admin = require('../../models/adminModel')
const AdminToken = require('../../models/adminTokenmodel')
const AdminPassReset = require('../../models/adminPassReset')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const shortid = require('shortid');
const express = require('express');
// const { sendEmail } = require('../../CommonSnips/emailSender');
const router = express.Router();

// const SECRET_KEY = "ahdjnvhviunvvni"

router.post('/createadmin', async (req, res) => {
    try {
        const newadmin = new Admin({
            admin_name: req.body.admin_name,
            admin_email: req.body.admin_email,
            admin_pass: await bcrypt.hash(req.body.admin_pass, 12)
        })

        const saveAdmin = await newadmin.save();
        res.status(200).json(saveAdmin);
    } catch (error) {
        res.status(500).json({ 'error': error })
    }
})


router.post('/adminlogin', async (req, res) => {
    const admin_email = req.body.admin_email
    const admin_pass = req.body.admin_pass
    try {
        const login = await Admin.findOne({ admin_email })
        if (!login) {
            return res.json({ "sts": 1, "msg": "Email is not Found" });
        } else {
            if (await bcrypt.compare(admin_pass, login.admin_pass)) {
                const token = jwt.sign({ adminId: login._id }, process.env.ADMIN_SECRET_KEY, { expiresIn: '6hr' })
                const expiresAt = new Date(Date.now() + (6 * 60 * 60 * 1000))
                const adminTokenSave = new AdminToken({
                    adminId: login._id,
                    token,
                    expiresAt
                })

                const aid = login._id
                const aemail = login.admin_email
                const aname = login.admin_name

                await adminTokenSave.save();
                return res.json({ "sts": 0, aid, aemail, aname, token })
            } else {
                return res.json({ "sts": 2, "msg": "Password is incorrect" });
            }
        }
    } catch (error) {
        res.status(500).json({ 'error': error })
    }
})

router.post('/checktoken', async (req, res) => {
    const token = req.body.token
    try {
        const tokenchk = await AdminToken.findOne({ token })
        if (!tokenchk) {
            return res.json({ 'tokensts': 1 })
        } else {
            return res.json({ 'tokensts': 0 })
        }

    } catch (error) {
        console.error(error);
    }
})


router.post('/updatepass', async (req, res) => {
    const { admin_email, old_pass, admin_pass } = req.body;
    try {
        const passchk = await Admin.findOne({ admin_email })
        if (await bcrypt.compare(old_pass, passchk.admin_pass)) {
            // console.log({"msg":"Old password is Matched"});
            const hasadmin_pass = await bcrypt.hash(admin_pass, 12)
            const updateAdminPass = await Admin.findOneAndUpdate(
                { admin_email: admin_email },
                { $set: { admin_pass: hasadmin_pass } },
                { new: true }
            )
            res.json({ "chpasssts": 0, "msg": "Password is Changed" })
        } else {
            res.json({ "chpasssts": 1, "msg": "Password Not  Changed as old Password not Match" })
        }
    } catch (error) {
        console.error(error);
    }
})


router.post('/logout', async (req, res) => {
    const token = req.body.token;
    try {
        const logout = await AdminToken.findOneAndDelete({ token })
        if (!logout) {
            return res.json({ 'logoutsts': 1, 'msg': "Logout Failed" })
        } else {
            return res.json({ 'logoutsts': 0, "msg": "Logout Success" })
        }
    } catch (error) {
        console.error(error);
    }
})


// send rest link
router.post('/sendresetlink', async (req, res) => {
    const { admin_email } = req.body;
    try {
        const findadmin = await Admin.findOne({ admin_email })
        if (!findadmin) {
            return res.json({ "sts": 1, "msg": "Email not found" });
        }
        else {
            const subject = "E-Shop : Reset Password Link"
            const reset_token = shortid.generate();
            const expiresAt = new Date(Date.now() + (60 * 60 * 1000))
            const text = `Your Reset Password Link is : http://localhost:3000/adminpassreset/${reset_token}`

            const saveResetToken = new AdminPassReset({
                admin_email,
                reset_token,
                expiresAt
            })

            const result = await saveResetToken.save();
            // sendEmail(admin_email, subject, text)
            return res.json({ "sts": 0, "msg": "Your reset token has been Sent", "reset_url": ` http://localhost:3000/adminpassreset/${reset_token}` })

        }
    } catch (error) {
        console.error(error);
    }
})


// reset pass 
router.post('/resetpass', async (req, res) => {
    const reset_token = req.body.reset_token;
    console.log(reset_token);
    const admin_pass = await bcrypt.hash(req.body.admin_pass, 12)
    try {
        const findadmin = await AdminPassReset.findOne({ reset_token })
        if (!findadmin) {
            return res.json({ "sts": 1, "msg": "Your Link Is Expired" })
        } else {
            const admin_email = findadmin.admin_email
            const updateAdminPass = await Admin.findOneAndUpdate(
                { admin_email: admin_email },
                { $set: { admin_pass: admin_pass } },
                { new: true }
            )

            const deleteToken = await AdminPassReset.findOneAndDelete({ reset_token })
            return res.json({ "sts": 0, "msg": "Your Password is Updated successfully" })
        }
    } catch (error) {
        console.error(error);
    }

})

module.exports = router;