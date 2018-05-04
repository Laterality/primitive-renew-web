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

	public componentWillMount() {
		this.min = this.props.pageCurrent - this.props.pagePlusMinus;
		this.max = this.props.pageCurrent + this.props.pagePlusMinus;

		if (this.min < this.props.pageMin) { this.min = this.props.pageMin; }
		if (this.max > this.props.pageMax) { this.max = this.props.pageMax; }
		for (let i = this.min; i <= this.max; i++) {
			this.arr.push(i);
		}
	}

	public render() {
		const toPrev = this.min > this.props.pageMin ? 
		(<a onClick={() => { this.props.onPreviousClick(this.props.pageCurrent, this.min); }}>≪ 이전 페이지</a>) : undefined;
		const toNext = this.max < this.props.pageMax ?
		(<a onClick={ () => { this.props.onNextClick(this.props.pageCurrent, this.max); } }>다음 페이지 ≫</a>) : undefined;
		console.log(this.arr);
		return (
			<div>
				{toPrev}
				{this.arr.map((num: number, idx: number) => {
					return <a 
					className="mx-3"
					onClick={() => this.props.onPageClick(num)}>
						{num}
					</a>;
				})}
				{toNext}
			</div>
		);
	}
}
