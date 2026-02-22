"""
Billing router - Handles subscription plans and billing.
"""

from fastapi import APIRouter, Depends, status

from src.application.dto import (
    PlanResponse,
    SubscriptionResponse,
    SubscribeRequest,
    InvoiceResponse,
)
from src.application.use_cases import (
    GetPlansUseCase,
    GetSubscriptionUseCase,
    SubscribeToPlanUseCase,
    CancelSubscriptionUseCase,
    GetInvoicesUseCase,
)
from src.interface.dependencies import (
    get_subscription_repository,
    get_current_active_user,
)

router = APIRouter()


@router.get("/plans", response_model=list[PlanResponse], status_code=status.HTTP_200_OK)
async def get_plans():
    """
    Get available subscription plans.
    
    Returns all available plans with pricing and features.
    """
    use_case = GetPlansUseCase()

    return await use_case.execute()


@router.get("/subscription", response_model=SubscriptionResponse, status_code=status.HTTP_200_OK)
async def get_subscription(
    current_user=Depends(get_current_active_user),
    subscription_repository=Depends(get_subscription_repository),
):
    """
    Get current user's subscription.
    
    Requires authentication.
    """
    use_case = GetSubscriptionUseCase(subscription_repository=subscription_repository)

    subscription = await use_case.execute(current_user.id)

    if subscription is None:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active subscription found",
        )

    return subscription


@router.post("/subscribe", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
async def subscribe_to_plan(
    request: SubscribeRequest,
    current_user=Depends(get_current_active_user),
    subscription_repository=Depends(get_subscription_repository),
):
    """
    Subscribe to a plan.
    
    Request body:
    - **plan_id**: Plan ID (basic/professional/enterprise)
    - **billing_cycle**: Billing cycle (monthly/yearly)
    
    Requires authentication.
    """
    # Create a mock payment service (in production, integrate with Stripe/PayPal)
    class MockPaymentService:
        async def process_payment(self, user_id, amount, billing_cycle):
            # Mock payment processing
            return {"status": "success", "transaction_id": "mock_tx_123"}

    payment_service = MockPaymentService()

    use_case = SubscribeToPlanUseCase(
        subscription_repository=subscription_repository,
        payment_service=payment_service,
    )

    return await use_case.execute(current_user.id, request)


@router.post("/cancel", response_model=SubscriptionResponse, status_code=status.HTTP_200_OK)
async def cancel_subscription(
    current_user=Depends(get_current_active_user),
    subscription_repository=Depends(get_subscription_repository),
):
    """
    Cancel current subscription.
    
    Requires authentication.
    """
    use_case = CancelSubscriptionUseCase(subscription_repository=subscription_repository)

    return await use_case.execute(current_user.id)


@router.get("/invoices", response_model=list[InvoiceResponse], status_code=status.HTTP_200_OK)
async def get_invoices(
    current_user=Depends(get_current_active_user),
):
    """
    Get current user's invoices.
    
    Requires authentication.
    """
    use_case = GetInvoicesUseCase()

    return await use_case.execute(current_user.id)
