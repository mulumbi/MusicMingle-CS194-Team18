import { ThreeDots } from 'react-loader-spinner';

type LoadingProps = {
    title?: string;
    message?: string;
};

const Loading: React.FC<LoadingProps> = (props) => {
	return (
		<div className="loading-page">
			<ThreeDots
                visible={true}
                height="100"
                width="100"
                color="#3697c749"
                radius="9"
                ariaLabel="three-dots-loading"
            />
            {props?.title 
                ? <h3>{props.title}</h3>
                : <h3>Loading...</h3>
            }
            {props?.message && 
                <p><i>{props.message}</i></p>
            }
		</div>
	);
}
export default Loading;
