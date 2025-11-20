import React, { useState, useEffect } from "react";
import axios from "axios";
import UserBottomNavigation from "../../components/UserBottomNavigation";
import { useAuth } from "../../context/AuthContext";
import bitcoin_and_cryptocurrency_fu from '../../images/bitcoin-and-cryptocurrency-the-fu.webp';
import cryptocurrency_main from '../../images/cryptocurrency-main.jpg'; 
import What_is_the_Difference_Between_Blockchain from '../../images/What is the Difference Between Blockchain And Bitcoin.png';
import bitcoin_orange from '../../images/bitcoin_orange.jpg';
import Bitcoin_Cashs_green from '../../images/Bitcoin_Cashs_green.png';
import LoadingSpinner from "../../components/LoadingSpinner";
import './tasks.css';

const Tasks = () => {
  
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [canClaimReward, setCanClaimReward] = useState(false);
  const [remainingClaims, setRemainingClaims] = useState(0);
  const [message, setMessage] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const user = useAuth();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const getCsrfToken = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/csrf-token`, { withCredentials: true });
    return res.data.csrfToken;
  };

  // 📊 Загрузка балансов
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const token = getCookie("token");
        const csrfToken = await getCsrfToken();
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/binance/user/balance`, {
          headers: { Authorization: `Bearer ${token}`, "csrf-token": csrfToken },
          withCredentials: true,
        });
        setBalances(res?.data?.balance || {});
      } catch (err) {
        console.error("Error fetching balances:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBalances();
  }, []);

  // 🔎 Проверяем статус
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = getCookie("token");
        const csrfToken = await getCsrfToken();
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/claim-status`, {
          headers: { Authorization: `Bearer ${token}`, "csrf-token": csrfToken },
          withCredentials: true,
        });
        setCanClaimReward(res?.data?.canClaimReward);
        setRemainingClaims(res?.data?.remainingClaims);
        setCompletedTasks(res?.data?.completedTasks || []);
        setMessage(res?.data?.message || "");
      } catch (err) {
        console.error("Error fetching claim status:", err);
      }
    };
    fetchStatus();
  }, []);

  // 💰 Выполнение задания
  const claimReward = async (taskId) => {
    setLoading(true);
    try {
      const token = getCookie("token");
      const csrfToken = await getCsrfToken();
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/claim-reward`,
        { user: user.user.id, taskId },
        {
          headers: { Authorization: `Bearer ${token}`, "csrf-token": csrfToken },
          withCredentials: true,
        }
      );

      setMessage(res?.data?.message);
      setCompletedTasks(res?.data?.completedTasks || []);
      setRemainingClaims(res?.data?.remainingClaims || 0);
    } catch (err) {
      console.error("Error claiming reward:", err);
      setMessage("Error claiming reward.");
    } finally {
      setLoading(false);
    }
  };

  const getTotalValueInUSD = () => {
    let total = 0;
    if (balances["BTC"]) total += balances["BTC"] * 103471;
    if (balances["USDT"]) total += balances["USDT"];
    if (balances["ETH"]) total += balances["ETH"] * 3485;
    if (balances["USDC"]) total += balances["USDC"];
    return total.toFixed(2);
  };

  const tasks = [
    { id: 1, image: bitcoin_and_cryptocurrency_fu, alt: "bitcoin and cryptocurrency" },
    { id: 2, image: cryptocurrency_main, alt: "cryptocurrency main" },
    { id: 3, image: What_is_the_Difference_Between_Blockchain, alt: "What is the Difference Between Blockchain" },
    { id: 4, image: bitcoin_orange, alt: "bitcoin orange" },
    { id: 5, image: Bitcoin_Cashs_green, alt: "Bitcoin Cashs Green" },
  ];

  const totalValueToUsd = getTotalValueInUSD();
 if(!balances){
  <LoadingSpinner/>
 }
  return (
    <div style={{paddingBottom:'24%'}}>
      <h1 className="tasks_big_h1">Your Tasks</h1>
      <p className="tasks_total_value">Total Value: ${loading ? "Loading..." : totalValueToUsd}</p>

      {totalValueToUsd >= 100 && canClaimReward ? (
        tasks?.map(task =>
          completedTasks?.includes(task?.id) ? null : (
            <div key={task?.id} className="tasks_taksks_parent_div">
              <img height="200px" src={task?.image} alt={task?.alt} />
              <h2>Click the button below to claim your 2% reward!</h2>
              <button onClick={() => claimReward(task?.id)} disabled={loading}>
                {loading ? "Processing..." : "Claim Reward"}
              </button>
            </div>
          )
        )
      ) : (
        <p style={{fontSize:'15px',textAlign:'center'}}>{message || "The game will start when the score reaches 100$"}</p>
      )}

      <UserBottomNavigation user={user}/>
    </div>
  );
};

export default Tasks;
