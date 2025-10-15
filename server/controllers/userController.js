import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        // Get userId from middleware (stored in req.userId)
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }
              const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
