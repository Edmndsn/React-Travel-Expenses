import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import searchIcon from "../../images/search-icon.svg";
import createExpenseIcon from "../../images/create-expense-icon.svg";
import filterIcon from "../../images/filter-icon.svg";
import "./Expenses.css";
import CreateExpense from "./CreateExpense";
import Filters from "./Filters";
import ExpenseCard from "./ExpenseCard";
import { useExpenses } from "../../Contexts/ExpensesContext";
import { db } from "../../firebase-config";
import {
	collection,
	doc,
	getDocs,
	updateDoc,
	setDoc,
	onSnapshot,
	query,
	orderBy,
	getDoc,
	serverTimestamp,
} from "firebase/firestore";

export default function Expenses() {
	const { expenses, createExpense, updateExpense, deleteExpense } =
		useExpenses();
	const [search, setSearch] = useState();
	const [currentExpenseId, setcurrentExpenseId] = useState("");
	const [filteredExpenses, setFilteredExpenses] = useState([]);
	const [currentExpense, setCurrentExpense] = useState("");

	function handleInput(event) {
		const { value } = event.target;
		setSearch(value);
		if (value) {
			setFilteredExpenses(
				expenses.filter((item) => item.title.includes(value))
			);
		} else setFilteredExpenses(expenses);
	}

	useEffect(() => {
		setFilteredExpenses(expenses);
	}, [expenses]);

	const expensesArr = filteredExpenses.map((expense) => (
		<ExpenseCard
			category={expense.category}
			key={expense.invoice}
			title={expense.title}
			company={expense.company}
			currency={expense.currency}
			amount={expense.amount}
			date={expense.date}
			invoice={expense.invoice}
			edit={edit}
			class="transaction-transactions"
		/>
	));

	async function edit(event, id) {
		event.stopPropagation();
		setcurrentExpenseId(id);
		setCurrentExpense(expenses.find((expense) => expense.invoice === id));
	}

	async function handleSubmit(data) {
		const id = `MGL${nanoid(7)}`;
		const invoice = {
			invoice: id,
		};

		const expenseData = {
			title: data.title,
			company: data.company,
			currency: data.currency,
			amount: data.amount,
			category: data.category,
			date: data.date,
			recurring: data.recurring,
		};
		// if (!currentExpenseId) {
		await createExpense(id, { ...expenseData, ...invoice });
		// } else {
		//   await updateExpense(currentExpenseId, expenseData);
		//   setCurrentExpense("");
		//   setcurrentExpenseId("");
		// }
	}

	// async function handleDelete() {
	//   await deleteExpense(currentExpenseId);
	//   setCurrentExpense("");
	//   setcurrentExpenseId("");
	// }

	// OLD CODE
	// const expenseRef = collection(db, "expense");
	// const q = query(expenseRef, orderBy("date", "desc"));

	// useEffect(() => {
	//   onSnapshot(expenseRef, async () => {
	//     const data = await getDocs(q);
	//     const expenseArray = data.docs.map(doc => doc.data());
	//     setExpense(expenseArray);
	//   });
	// }, []);

	const [displayCreateExpense, setDisplayCreateExpense] = useState(false);
	const [displayFilters, setDisplayFilters] = useState(false);
	const navigate = useNavigate();

	function handleCreateExpenseModal() {
		setDisplayCreateExpense(true);
		navigate("create-expense");
	}

	function handleDisplayFilters() {
		setDisplayFilters((displayFilters) => !displayFilters);
		// navigate("filters")
	}

	return (
		<>
			<section className="expenses-container">
				{displayCreateExpense && (
					<CreateExpense
						handleClick={handleSubmit}
						// handleInput={handleInput}
						displayCreateExpenseState={setDisplayCreateExpense}
						currentExpense={currentExpense}
						setCurrentExpense={setCurrentExpense}
					/>
				)}
				<nav className="navbar-container">
					<h1 className="title">Expenses</h1>
					<button className="profile-btn">
						{/* // <img src=PROFILE PIC/>  */}
						<h3>NAME OF PROFILE-CHANGE</h3>
					</button>
				</nav>

				<div className="expenses-content">
					<div className="search-container">
						<div className="search-bar">
							<img src={searchIcon} />
							<input
								className="search-input"
								type="text"
								placeholder="Search for specific transactions"
							></input>
						</div>
						<div className="expense-buttons">
							{/* ADD FUNCTIONALITY SO ON CLICK IT OPENS CREATE EXPENSE*/}
							<button
								className="create-expense"
								onClick={handleCreateExpenseModal}
							>
								<img src={createExpenseIcon} />
								Create Expense
							</button>
							{/* ADD FUNCTIONALITY SO IT COMES UP WITH FILTERS */}
							<button
								className="filter-expenses"
								onClick={handleDisplayFilters}
							>
								<img src={filterIcon} />
								Filters
							</button>
						</div>
					</div>
					<div className="expenses-table">
						{displayFilters && (
							<Filters
								displayFiltersState={setDisplayFilters}
								expenses={expenses}
							/>
						)}
						<div className="input-titles">
							<p>NAME/BUSINESS</p>
							<p>CATEGORY</p>
							<p>AMOUNT</p>
							<p>DATE</p>
							<p>INVOICE ID</p>
							<p>ACTION</p>
						</div>
						<div className="expense-cards">
							{/* <ExpenseCard
                currentExpense={currentExpense}
                setCurrentExpense={currentExpense}
                currentExpenseId={currentExpenseId}
                setcurrentExpenseId={setcurrentExpenseId}
                key={expenses.id}
              /> */}
							{expensesArr}
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
