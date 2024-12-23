import { Injectable } from '@nestjs/common';

//custom rate-limiter for sending emails (prevents abuse)
@Injectable()
export class RateLimiterService {
    //list of email requests that have been made
    private emailRequests = new Map<string, { count: number; lastRequest: Date }>();

    isAllowed(email: string): boolean {
        const now = new Date();
        const limit = 5; // Max requests allowed
        const ttl = 60000; // 1-minute TTL (in miliseconds)

        const emailRecord = this.emailRequests.get(email);

        if (!emailRecord) {
            this.emailRequests.set(email, { count: 1, lastRequest: now });
            return true;
        }

        const elapsedTime = now.getTime() - emailRecord.lastRequest.getTime();

        if (elapsedTime > ttl) {
            this.emailRequests.set(email, { count: 1, lastRequest: now });
            return true;
        }

        //requests full 
        if (emailRecord.count >= limit) {
            return false;
        }

        //increment num of request
        this.emailRequests.set(email, {
            count: emailRecord.count + 1,
            lastRequest: now,
        });

        return true;
    }
}
