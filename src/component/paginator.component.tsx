/**
 * Board paginator component
 * 
 * author: Jinwoo Shin
 * date: 2018-04-30
 */
import * as React from "react";

export interface IBoardPaginatorProps {
	pageCurrent: number;
	pageMin: number;
	pageMax: number;
	pagePlusMinus: number;
	onPageClick: (numPage: number) => void;
	onPreviousClick: (currentPage: number, minPage: number) => void;
	onNextClick: (currentPage: number, maxPage: number) => void;
}

export class BoardPaginator extends React.Component<IBoardPaginatorProps> {

	private min: number;
	private max: number;
	private arr: number[];

	public constructor(props: IBoardPaginatorProps) {
		super(props);
		this.min = this.props.pageMin;
		this.max = this.props.pageMax;
		this.arr = [];
	}

	public render() {
		this.min = this.props.pageCurrent - this.props.pagePlusMinus;
		this.max = this.min + (this.props.pagePlusMinus * 2);

		if (this.min < this.props.pageMin) {
			this.max += this.props.pageMin - this.min;
			this.min = this.props.pageMin;
		}
		if (this.max > this.props.pageMax) {
			this.max = this.props.pageMax;
			this.min -= this.max - this.props.pageMax;
			if (this.min < this.props.pageMin) { this.min = this.props.pageMin; }
		}
		this.arr = [];
		for (let i = this.min; i <= this.max; i++) {
			this.arr.push(i);
		}

		const showPrev = this.min > this.props.pageMin;
		const showNext = this.max < this.props.pageMax;
		return (
			<div>
				<a className={`${showPrev ? "visible" : "invisible"} text-dark`} href="#"
				onClick={() => { this.props.onPreviousClick(this.props.pageCurrent, this.min); }}>≪ 이전 페이지</a>
				{this.arr.map((num: number, idx: number) => {
					if (this.props.pageCurrent === num) {
						return <a
						key={idx}
						className="text-dark mx-3"><strong>{num}</strong></a>;
					}
					return <a 
					key={idx}
					className="text-dark mx-3" href="#"
					onClick={() => this.props.onPageClick(num)}>
						{num}
					</a>;
				})}
				<a className={`${showNext ? "visible" : "invisible"} text-dark`} href="#"
				onClick={ () => { this.props.onNextClick(this.props.pageCurrent, this.max); } }>다음 페이지 ≫</a>
			</div>
		);
	}
}
