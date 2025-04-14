import React from "react";
import "./Waitlist.css";

function Waitlist({ waitlist }) {
    return (
        <div className="waitlist" key={waitlist.id}>
            <h3>{waitlist.title}</h3>
            <h2>{waitlist.id}</h2>
            <p>{waitlist.description}</p>
            <form
                action={
                    window._env_.MOBILE_URL +
                    "/join?presentationId=" +
                    waitlist.id
                }
                method="POST"
            >
                <button type="submit" className="button">
                    Join on mobile
                </button>
            </form>
            <table className="reactions">
                <tbody>
                    {waitlist.slideReactions.map((reactions) => (
                        <tr>
                            <td>Slide {reactions.slideNumber}:</td>
                            <td>
                                <ul>
                                    {reactions.reactions.map((reaction) => (
                                        <li>
                                            {reaction.reaction}({reaction.countOfReaction})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Waitlist;
